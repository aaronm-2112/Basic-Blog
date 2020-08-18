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
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var Auth_1 = __importDefault(require("../Auth/Auth"));
var Blog_1 = __importDefault(require("./Blog"));
var BlogSearchCriteria_1 = require("./BlogSearchCriteria");
var path_1 = __importDefault(require("path"));
var BlogController = /** @class */ (function () {
    function BlogController(repo) {
        this.repo = repo;
        this.router = express_1.default.Router();
        this.auth = new Auth_1.default(); //TODO: Make a singleton?
    }
    BlogController.prototype.registerRoutes = function (app) {
        var _this = this;
        //returns blog creation view
        this.router.get('/blog', this.auth.authenitcateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var searchBy, value, blogid, keyCondition, blogs, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("Root blog route");
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 9, , 10]);
                        searchBy = req.query.param;
                        value = req.query.value;
                        blogid = req.query.key;
                        keyCondition = req.query.keyCondition;
                        console.log(searchBy);
                        console.log(value);
                        console.log(blogid);
                        console.log(keyCondition);
                        if (!(value !== "" && value !== undefined)) return [3 /*break*/, 8];
                        blogs = void 0;
                        _a = searchBy;
                        switch (_a) {
                            case BlogSearchCriteria_1.searchParameters.Username: return [3 /*break*/, 2];
                            case BlogSearchCriteria_1.searchParameters.Title: return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 2: return [4 /*yield*/, this.repo.findAll(BlogSearchCriteria_1.searchParameters.Username, value, blogid, keyCondition)];
                    case 3:
                        //search the blog repo using the query parameter
                        blogs = _b.sent();
                        return [3 /*break*/, 7];
                    case 4: return [4 /*yield*/, this.repo.findAll(BlogSearchCriteria_1.searchParameters.Title, value, blogid, keyCondition)];
                    case 5:
                        //search the blog repo using the query parameter
                        blogs = _b.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        //invalid search parameter -- result not found
                        res.sendStatus(404);
                        return [2 /*return*/];
                    case 7:
                        //return the results to the user 
                        res.send(blogs);
                        return [2 /*return*/];
                    case 8:
                        res.render('CreateBlog');
                        return [3 /*break*/, 10];
                    case 9:
                        e_1 = _b.sent();
                        res.sendStatus(400);
                        console.log(e_1);
                        throw new Error(e_1);
                    case 10: return [2 /*return*/];
                }
            });
        }); });
        //return a specific blog for viewing/editing or a list of blogs based off a query term
        //TODO: update the edit parameter and turn it into a query parameter -- This is more RESTful
        this.router.get('/blog/:blogID/:edit', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var blogID, blog, imagePath, userID, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("In this route");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log("In get blog route");
                        blogID = req.params.blogID;
                        return [4 /*yield*/, this.repo.find(BlogSearchCriteria_1.searchParameters.BlogID, blogID)];
                    case 2:
                        blog = _a.sent();
                        imagePath = "http://localhost:3000/" + path_1.default.normalize(blog.titleimagepath);
                        //check the value of edit
                        if (req.params.edit === "true") {
                            console.log("Editing");
                            userID = { id: "" };
                            this.auth.setSubject(req.cookies["jwt"], userID);
                            console.log("After subject function");
                            //check if a userID was extracted from the incoming JWT
                            if (userID.id === "silly") {
                                console.log("UserID is silly");
                                //if not return because there is no way to verify if the incoming user owns the blog they want to edit
                                res.sendStatus(400);
                                return [2 /*return*/];
                            }
                            //check if the incoming userID matches the username of the blog's owner -- only owners can edit their blog
                            if (userID.id === blog.username) {
                                //edit the blog -- TODO: Make this an edit blog page instead TODO: Make this one blog page with logic to determine this.
                                res.render('EditBlog', {
                                    titleImagePath: imagePath,
                                    title: blog.title,
                                    username: blog.username,
                                    content: blog.content
                                });
                                return [2 /*return*/];
                            }
                            else {
                                //user does not have access
                                res.sendStatus(400);
                                return [2 /*return*/];
                            }
                        }
                        else {
                            //render the blog template with the blog's properties
                            res.render('Blog', {
                                titleImagePath: imagePath,
                                title: blog.title,
                                username: blog.username,
                                content: blog.content
                            });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        res.sendStatus(400);
                        console.log(e_2);
                        throw new Error(e_2);
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        //create a blog resource --return blogID 
        //A blog resource contains a path to the blog's title image if one was uploaded.
        //This image path needs to be posted to the uploads path, then linked to blog with a patch request to blog.
        this.router.post('/blog', this.auth.authenitcateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var blog, blogID, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        blog = new Blog_1.default();
                        //set the username -- foreign key for the Blog entity that connects it to the User entity
                        blog.username = res.locals.userId;
                        //set the content of the blog
                        blog.content = req.body.content;
                        //set the title of the blog
                        blog.title = req.body.title;
                        return [4 /*yield*/, this.repo.create(blog)];
                    case 1:
                        blogID = _a.sent();
                        //return the blog id to the user
                        res.send(blogID.toString());
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        res.sendStatus(400);
                        throw new Error(e_3);
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        //patch a blog entity with content, titleImagePath, username, or the title as properties that can be updated
        this.router.patch('/blog/:blogID', this.auth.authenitcateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userID, blog, editBlog, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        console.log("Patch route!");
                        console.log(req.body);
                        userID = res.locals.userId;
                        return [4 /*yield*/, this.repo.find(BlogSearchCriteria_1.searchParameters.BlogID, req.params.blogID)];
                    case 1:
                        blog = _a.sent();
                        //TODO: Make blog method to do this b/c this is not/shouldn't be controller logic 
                        //check if the incoming userID isn't the same as the blog identified with the incoming blogID
                        if (userID !== blog.username) {
                            //the user does not have authorization to edit this blog
                            res.sendStatus(400);
                            return [2 /*return*/];
                        }
                        editBlog = new Blog_1.default();
                        //TODO: Make blog method to do this b/c this is not/shouldn't be controller logic 
                        //determine which blog properties are being patched based off request body parameters
                        if (req.body.content !== null && req.body.content !== undefined) {
                            editBlog.content = req.body.content;
                        }
                        //blog title
                        if (req.body.title !== null && req.body.title !== undefined) {
                            editBlog.title = req.body.title;
                        }
                        //blog's path to titleimage
                        if (req.body.titleImagePath !== null && req.body.titleImagePath !== undefined) {
                            editBlog.titleimagepath = req.body.titleImagePath;
                        }
                        //blog's username value -- TODO: Determine if this is necessary here
                        if (req.body.username !== null && req.body.username !== undefined) {
                            editBlog.username = req.body.username;
                        }
                        //set blog object's blogID using the incoming request parameter
                        editBlog.blogid = parseInt(req.params.blogID);
                        //update the corresponding blog -- properties not being patched stay as Blog object constructor defaults
                        return [4 /*yield*/, this.repo.update(editBlog)];
                    case 2:
                        //update the corresponding blog -- properties not being patched stay as Blog object constructor defaults
                        _a.sent();
                        console.log("Successful update!");
                        //send no content success
                        res.sendStatus(204);
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _a.sent();
                        console.error(e_4);
                        res.sendStatus(400);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        //allow the user to edit a blog -- TODO: Change because Edit is not a resource
        this.router.get('/blog/edit/:blogID', this.auth.authenitcateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var blogID, blog, username, imagePath, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        blogID = req.params.blogID;
                        return [4 /*yield*/, this.repo.find(BlogSearchCriteria_1.searchParameters.BlogID, blogID)];
                    case 1:
                        blog = _a.sent();
                        username = res.locals.userId;
                        //check if the username in the blog properties matches the username of the user making the request
                        if (!blog.creator(username)) {
                            //If not stop and return unauthorized b/c the user did not create this blog
                            res.sendStatus(401);
                            return [2 /*return*/];
                        }
                        imagePath = "http://localhost:3000/" + path_1.default.normalize(blog.titleimagepath);
                        //change \ to / in blog's path to the title image
                        imagePath = imagePath.replace(/\\/g, "/");
                        //direct the user to the blog edit view with blog parameters
                        res.render('EditBlog', {
                            title: blog.title,
                            titleImagePath: imagePath,
                            content: blog.content
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        e_5 = _a.sent();
                        res.sendStatus(400);
                        throw new Error(e_5);
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        //register router with the app
        app.use(this.router);
    };
    return BlogController;
}());
exports.default = BlogController;
