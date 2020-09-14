"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Purpose: Define the filesystem for the application. 
var express = __importStar(require("express"));
var Auth_1 = __importDefault(require("../Auth/Auth"));
var BlogSearchCriteria_1 = require("../Blog/BlogSearchCriteria");
var Directory = /** @class */ (function () {
    //setup auth and inject repositories
    function Directory(userRepository, blogRepository) {
        this.router = express.Router();
        //all the paths in the filesystem that can be reached through normal user navigation
        this.paths = { root: '/', search: '/search', profile: '/users/', profileEdit: '/profile/edit', blog: '/blog' };
        this.auth = new Auth_1.default();
        this.userRepository = userRepository;
        this.blogRepository = blogRepository;
    }
    //direct express middleware to render the paths using handlebars
    Directory.prototype.registerRoutes = function (app) {
        var _this = this;
        //render root path -- for now make unguarded version of homepage
        //TODO: MAke a special authentication method that is called as middleware that doesn't fail but rather passes in info that user is not authenticated. This is to avoid the synchronous setSubject call on the homepage.
        this.router.get("" + this.paths.root, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userID, user, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        userID = { id: "" };
                        //extract the userid from the jwt 
                        this.auth.setSubject(req.cookies["jwt"], userID);
                        console.log(userID);
                        if (!userID.id.length) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.userRepository.find(userID.id)];
                    case 1:
                        user = _a.sent();
                        //if so render homepage with a link to the user profile
                        res.render('Homepage', {
                            links: [["home", this.paths.root], ["search", this.paths.search], ["profile", this.paths.profile + ("" + user.getUserID())]]
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        //render homepage without a link to the user profile
                        res.render('Homepage', {
                            links: [["home", this.paths.root], ["search", this.paths.search]]
                        });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        //render search path
        this.router.get("" + this.paths.search, function (req, res) {
            //get the userID from the cookie
            var userID = { id: "" };
            //extract the userid from the jwt 
            _this.auth.setSubject(req.cookies["jwt"], userID);
            //determine if the user is signed in
            if (userID.id.length) {
                //send entire navigatin options
                res.render('Search', { links: [["home", _this.paths.root], ["search", _this.paths.search], ["profile", _this.paths.profile]] });
            }
            else {
                //no profile option
                res.render('Search', { links: [["home", _this.paths.root], ["search", _this.paths.search]] });
            }
        });
        //render profile page
        this.router.get("" + this.paths.profile, this.auth.authenitcateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var username, blogid, keyCondition, user, blogs, blogDetails_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        username = res.locals.userId;
                        blogid = req.query.key;
                        console.log(blogid);
                        keyCondition = req.query.keyCondition;
                        return [4 /*yield*/, this.userRepository.find(username)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.blogRepository.findAll(BlogSearchCriteria_1.searchParameters.Username, user.username, blogid, keyCondition)];
                    case 2:
                        blogs = _a.sent();
                        blogDetails_1 = new Array();
                        //Extract the title and blogID and place them into a structure with the paths to edit and view blogs
                        blogs.forEach(function (blog) {
                            blogDetails_1.push({ title: blog.title, editPath: "http://localhost:3000/blogs/" + blog.blogid + "?edit=true", viewPath: "http://localhost:3000/blogs/" + blog.blogid + "?edit=false" });
                        });
                        //  1. Send user profile info to profile partial
                        res.render('Profile', {
                            userName: user.getUsername(), firstName: user.getFirstname(),
                            lastName: user.getLastname(), bio: user.getBio(),
                            blogDetails: blogDetails_1,
                            profileImagePath: user.getProfilePicPath()
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.log("profile get" + e_2);
                        res.sendStatus(400);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        //render profile editing page
        this.router.get("" + this.paths.profileEdit, this.auth.authenitcateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var username, user, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        username = res.locals.userId //TODO: Add error checking
                        ;
                        return [4 /*yield*/, this.userRepository.find(username)];
                    case 1:
                        user = _a.sent();
                        //  1. Send user profile info to profile edit
                        res.render('ProfileEdit', {
                            userName: user.getUsername(), firstName: user.getFirstname(),
                            lastName: user.getLastname(), bio: user.getBio(), profileImagePath: user.getProfilePicPath()
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        console.error("Profile edit get" + e_3);
                        res.sendStatus(400);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        //render the blog creation page
        this.router.get('/blog', this.auth.authenitcateJWT, function (req, res) {
            res.render('CreateBlog');
        });
        //render wildcard path -- needs to be after all routes defined in other paths too
        // this.router.get('*', (req: Request, res: Response) => {
        //   res.send("Wow nothing there").status(200);
        // });
        //Use the directory routes at root level 
        app.use('/', this.router);
    };
    return Directory;
}());
exports.default = Directory;
