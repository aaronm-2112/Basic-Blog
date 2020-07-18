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
var multer_1 = __importDefault(require("multer"));
var Blog_1 = __importDefault(require("./Blog"));
var BlogSearchCriteria_1 = require("./BlogSearchCriteria");
var path_1 = __importDefault(require("path"));
var BlogController = /** @class */ (function () {
    function BlogController(repo) {
        this.upload = multer_1.default({ dest: 'uploads/' });
        this.repo = repo;
        this.router = express_1.default.Router();
        this.auth = new Auth_1.default(); //TODO: Make a singleton?
    }
    BlogController.prototype.registerRoutes = function (app) {
        var _this = this;
        //returns blog creation view
        this.router.get('/blog', this.auth.authenitcateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    res.render('CreateBlog');
                }
                catch (e) {
                    res.sendStatus(400);
                    console.log(e);
                    throw new Error(e);
                }
                return [2 /*return*/];
            });
        }); });
        //return a specific blog for viewing
        this.router.get('/blog/:blogID', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var blogID, blog, imagePath, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        blogID = req.params.blogID;
                        return [4 /*yield*/, this.repo.find(BlogSearchCriteria_1.searchParameters.BlogID, blogID)];
                    case 1:
                        blog = _a.sent();
                        imagePath = "http://localhost:3000/" + path_1.default.normalize(blog.titleImagePath);
                        //change \ to / in blog's path to the title image
                        imagePath = imagePath.replace(/\\/g, "/");
                        //render the blog template with the blog's properties
                        res.render('Blog', {
                            titleImagePath: imagePath,
                            title: blog.title,
                            username: blog.username,
                            content: blog.content
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        res.sendStatus(400);
                        console.log(e_1);
                        throw new Error(e_1);
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        //Receive blog banner image place it in public images and create a blog resource
        //TODO: Ensure an image is sent and not other kinds of media[security thing]
        this.router.post('/blog', this.auth.authenitcateJWT, this.upload.single("image"), function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var blog, blogID, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        if (!req.file) return [3 /*break*/, 3];
                        console.log(req.file);
                        blog = new Blog_1.default();
                        //set titleImagePath to the uploaded image's path attribute
                        blog.titleImagePath = req.file.path;
                        //set the username -- foreign key for the blog
                        blog.username = res.locals.userId;
                        //add the blog to the database 
                        return [4 /*yield*/, this.repo.create(blog)];
                    case 1:
                        //add the blog to the database 
                        _a.sent();
                        //find the blog's ID and send back to user 
                        console.log("Creation successful");
                        return [4 /*yield*/, this.repo.find(BlogSearchCriteria_1.searchParameters.TitleImagePath, req.file.path)];
                    case 2:
                        blog = _a.sent();
                        blogID = blog.blogID.toString();
                        //return the blog id to the user
                        res.send(blogID);
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        e_2 = _a.sent();
                        res.sendStatus(400);
                        console.log(e_2);
                        throw new Error(e_2);
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        //Receive a blog's text content and update the blog data (so this should be a patch to something like /blog/{blogID})
        //Possible request body parameters: content, title, titleImagePath, username
        this.router.patch('/blog/:blogID', this.auth.authenitcateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var blog, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        blog = new Blog_1.default();
                        //TODO: Make blog method to do this not controller logic 
                        //determine which blog properties are being patched based off request body parameters
                        if (req.body.content !== null && req.body.content !== undefined) {
                            blog.content = req.body.content;
                        }
                        //blog title
                        if (req.body.title !== null && req.body.title !== undefined) {
                            blog.title = req.body.title;
                        }
                        //blog's path to titleimage
                        if (req.body.titleImagePath !== null && req.body.titleImagePath !== undefined) {
                            blog.titleImagePath = req.body.titleImagePath;
                        }
                        //blog's username value -- TODO: Determine if this is necessary here
                        if (req.body.username !== null && req.body.username !== undefined) {
                            blog.username = req.body.username;
                        }
                        //set blog object's blogID using the incoming request parameter
                        blog.blogID = parseInt(req.params.blogID);
                        //update the corresponding blog -- properties not being patched stay as Blog object constructor defaults
                        return [4 /*yield*/, this.repo.update(blog)];
                    case 1:
                        //update the corresponding blog -- properties not being patched stay as Blog object constructor defaults
                        _a.sent();
                        console.log("Successful update!");
                        //send no content success
                        res.sendStatus(204);
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        console.error(e_3);
                        res.sendStatus(400);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        //allow the user to edit a blog
        this.router.get('/blog/edit/:blogID', this.auth.authenitcateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var blogID, blog, username, imagePath, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        blogID = req.params.blogID;
                        return [4 /*yield*/, this.repo.find(BlogSearchCriteria_1.searchParameters.BlogID, blogID)];
                    case 1:
                        blog = _a.sent();
                        username = res.locals.userId;
                        console.log(username);
                        //check if the username in the blog properties matches the username of the user making the request
                        if (!blog.creator(username)) {
                            //If not stop and return unauthorized b/c the user did not create this blog
                            res.sendStatus(401);
                            return [2 /*return*/];
                        }
                        imagePath = "http://localhost:3000/" + path_1.default.normalize(blog.titleImagePath);
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
                        e_4 = _a.sent();
                        res.sendStatus(400);
                        throw new Error(e_4);
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
