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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = __importDefault(require("./User"));
var Auth_1 = __importDefault(require("../Auth/Auth"));
var express = __importStar(require("express"));
var salt_1 = require("../Common/salt");
var BlogSearchCriteria_1 = require("../Blog/BlogSearchCriteria");
//Purpose: Handle all user view behaviour.
//Rather than use a service for representing a compound model I chose to place two repos in the UserControler.
//           Rationale: 
//              b/c a service is used for business logic utilizing repos the lack of such logic in this simple controller 
//              disallows me to justify introducing another abstraction. 
var UserController = /** @class */ (function () {
    function UserController(userRepo, blogRepo) {
        // setup the user repository 
        this.userRepository = userRepo;
        // setup the unguarded router 
        this.router = express.Router();
        // setup authentication-- TODO: Make a singleton?
        this.auth = new Auth_1.default();
        //setup blog repository
        this.blogRepo = blogRepo;
    }
    UserController.prototype.registerRoutes = function (app) {
        //UNGUARDED ROUTES------------------------------------------------------------------
        var _this = this;
        //SIGNUP
        this.router.post('/signup', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var user, userInserted, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        user = new User_1.default();
                        user.setUsername(req.body.username);
                        user.setEmail(req.body.email);
                        user.setPassword(req.body.password);
                        console.log(user);
                        return [4 /*yield*/, this.userRepository.create(user)];
                    case 1:
                        userInserted = _a.sent();
                        // if insertion successful return success
                        if (userInserted) {
                            // TODO: Render a login page
                            res.sendStatus(201);
                        }
                        else { // else return failure 
                            res.sendStatus(400);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        res.sendStatus(400);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        //LOGIN
        this.router.post("/login", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var username, password, user, samePassword, jwtBearerToken, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        username = req.body.username;
                        password = req.body.password;
                        return [4 /*yield*/, this.userRepository.find(username)];
                    case 1:
                        user = _a.sent();
                        // TODO: Test this error handling
                        if (!user) {
                            res.status(400).send();
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, salt_1.compareUserPassword(password, user.getPassword())];
                    case 2:
                        samePassword = _a.sent();
                        if (!samePassword) {
                            //stop execution-- incorrect password
                            res.sendStatus(400);
                            return [2 /*return*/];
                        }
                        console.log(user);
                        jwtBearerToken = this.auth.createJWT(user);
                        console.log(jwtBearerToken);
                        //send back the bearer token to the user KEY: Too long to be secure. Usually other tactics as well are used. But this is practice. 
                        //res.status(200).send({ "idToken": jwtBearerToken, "expiresIn": "2 days" }) //TODO: Make configurable but is fine for now.
                        //cookies are sent automaticlaly with every request
                        res.cookie('jwt', jwtBearerToken, {
                            expires: new Date(Date.now() + 1728000),
                            secure: false,
                            httpOnly: true
                        }).sendStatus(200);
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        console.log("Login post" + e_2);
                        res.sendStatus(400);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        //GUARDED ROUTES------------------------------------------------------------------------------------------------------------------
        this.router.get("/profile", this.auth.authenitcateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var username, blogid, keyCondition, user, blogs, blogDetails_1, e_3;
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
                        return [4 /*yield*/, this.blogRepo.findAll(BlogSearchCriteria_1.searchParameters.Username, user.username, blogid, keyCondition)];
                    case 2:
                        blogs = _a.sent();
                        blogDetails_1 = new Array();
                        //Extract the title and blogID and place them into a structure with the paths to edit and view blogs
                        blogs.forEach(function (blog) {
                            blogDetails_1.push({ title: blog.title, editPath: "http://localhost:3000/blog/" + blog.blogid + "/true", viewPath: "http://localhost:3000/blog/" + blog.blogid + "/false" });
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
                        e_3 = _a.sent();
                        console.log("profile get" + e_3);
                        res.sendStatus(400);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        //TODO: Allow editing to happen on the Profile page instead of on a separate page
        this.router.get("/profile/edit", this.auth.authenitcateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var username, user, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        username = res.locals.userId //TODO: Add error checking
                        ;
                        return [4 /*yield*/, this.userRepository.find(username)];
                    case 1:
                        user = _a.sent();
                        //set path to the image from the Views directory [views are in /Views] using absolute paths
                        //TODO: Use env to get absolute path not hardcoded string
                        //let imagePath: string = "http://localhost:3000/" + path.normalize(user.getProfilePicPath());
                        //  1. Send user profile info to profile edit
                        res.render('ProfileEdit', {
                            userName: user.getUsername(), firstName: user.getFirstname(),
                            lastName: user.getLastname(), bio: user.getBio(), profileImagePath: user.getProfilePicPath()
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        console.error("Profile edit get" + e_4);
                        res.sendStatus(400);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        //TODO: Security checks
        //TOOD: Refactor into a route that points to a resource?
        //TODO: Refactor into a Put or Patch request
        this.router.post("/profile/edit", this.auth.authenitcateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userName, firstName, lastName, bio, profilePicPath, user, newuser, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        userName = res.locals.userId;
                        firstName = req.body.firstName;
                        lastName = req.body.lastName;
                        bio = req.body.bio;
                        profilePicPath = req.body.profilePicturePath;
                        console.log(profilePicPath);
                        user = new User_1.default();
                        user.setUsername(userName);
                        if (req.body.firstName !== null && req.body.firstName !== undefined) {
                            user.setFirstname(firstName);
                        }
                        //blog title
                        if (req.body.lastName !== null && req.body.lastName !== undefined) {
                            user.setLastname(lastName);
                        }
                        //blog's path to titleimage
                        if (req.body.bio !== null && req.body.bio !== undefined) {
                            user.setBio(bio);
                        }
                        //blog's username value -- TODO: Determine if this is necessary here
                        if (req.body.profilePicturePath !== null && req.body.profilePicturePath !== undefined) {
                            user.setProfilePicPath(profilePicPath);
                        }
                        console.log(user.getProfilePicPath());
                        //update the user information in the database
                        return [4 /*yield*/, this.userRepository.update(user)];
                    case 1:
                        //update the user information in the database
                        _a.sent();
                        return [4 /*yield*/, this.userRepository.find(user.getUsername())];
                    case 2:
                        newuser = _a.sent();
                        console.log(newuser);
                        res.sendStatus(200);
                        return [3 /*break*/, 4];
                    case 3:
                        e_5 = _a.sent();
                        console.error("Profile edit post" + e_5);
                        res.sendStatus(400);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        // register the routes
        app.use(this.router);
    };
    return UserController;
}());
exports.default = UserController;
