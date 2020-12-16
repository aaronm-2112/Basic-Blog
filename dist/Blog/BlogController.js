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
var express_validator_1 = require("express-validator");
var path_1 = __importDefault(require("path"));
var Auth_1 = __importDefault(require("../Auth/Auth"));
var Blog_1 = __importDefault(require("./Blog"));
var BlogSearchCriteria_1 = require("./BlogSearchCriteria");
var BadRequestError_1 = require("../Common/Errors/BadRequestError");
var NotAcceptableError_1 = require("../Common/Errors/NotAcceptableError");
var NotFoundError_1 = require("../Common/Errors/NotFoundError");
var ForbiddenError_1 = require("../Common/Errors/ForbiddenError");
var validate_request_1 = require("../Middlewares/validate-request");
var BlogController = /** @class */ (function () {
    function BlogController(repo) {
        this.repo = repo;
        this.router = express_1.default.Router();
        this.auth = new Auth_1.default(); //TODO: Make a singleton?
    }
    BlogController.prototype.registerRoutes = function (app) {
        var _this = this;
        //returns all blogs defined by the client's query parameters
        //Query parameters: param = username || title, value, blogid, keyCondition
        //Accept header: application/json
        //Content Type header: application/json 
        // 12/15/20 New error handling middleware will catch and log errors + async routes in express-async-errors throws automatically so removed try catch block
        this.router.get('/blogs', [
            express_validator_1.query("param")
                .trim()
                .custom(function (param) { return (param === BlogSearchCriteria_1.searchParameters.Title || param === BlogSearchCriteria_1.searchParameters.Username); })
                .withMessage("You must supply a valid search parameter: title or username."),
            express_validator_1.query("value")
                .trim()
                .isLength({ min: 1 })
                .withMessage("You must supply a parameter value."),
            express_validator_1.query("key")
                .trim()
                .custom(function (key) { return parseInt(key) >= 0; })
                .withMessage("You must supply a number greater than or equal to 0 as the search key."),
            express_validator_1.query("keyCondition")
                .trim()
                .custom(function (keyCondition) { return (keyCondition == '>' || keyCondition == '<'); })
                .withMessage("You must supply > or < as the key's search condition.")
        ], validate_request_1.validateRequest, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var searchBy, searchByValue, blogid, keyCondition, blogs, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!req.accepts('application/json')) {
                            throw new NotAcceptableError_1.NotAcceptableError();
                        }
                        searchBy = req.query.param;
                        searchByValue = req.query.value;
                        blogid = req.query.key;
                        keyCondition = req.query.keyCondition;
                        //decode the searchbyvalue passed in
                        searchByValue = decodeURIComponent(searchByValue);
                        _a = searchBy;
                        switch (_a) {
                            case BlogSearchCriteria_1.searchParameters.Username: return [3 /*break*/, 1];
                            case BlogSearchCriteria_1.searchParameters.Title: return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, this.repo.findAll(BlogSearchCriteria_1.searchParameters.Username, searchByValue, blogid, keyCondition)];
                    case 2:
                        //search the blog repo using the query parameter
                        blogs = _b.sent();
                        return [3 /*break*/, 6];
                    case 3: return [4 /*yield*/, this.repo.findAll(BlogSearchCriteria_1.searchParameters.Title, searchByValue, blogid, keyCondition)];
                    case 4:
                        //search the blog repo using the query parameter
                        blogs = _b.sent();
                        return [3 /*break*/, 6];
                    case 5: 
                    //invalid search parameter -- result not found -- TODO: Make InvalidParameter error
                    throw new BadRequestError_1.BadRequestError();
                    case 6:
                        //return the results to the user 
                        res.status(200).send(blogs);
                        return [2 /*return*/];
                }
            });
        }); });
        //return a specific blog for viewing/editing or a list of blogs based off a query term
        //Query parameters: editPage - view the blog resorce in an editable html representation(not applicable to application/json)
        //Accept options: text/html or application/json
        //Response Content Type: text/html or application/json
        // 12/15/20 New error handling middleware will catch and log errors + async routes in express-async-errors throws automatically so removed try catch block
        this.router.get('/blogs/:blogID', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var blogID, blog, BASE_URL, imagePath, edit, userID;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        blogID = req.params.blogID;
                        return [4 /*yield*/, this.repo.find(BlogSearchCriteria_1.searchParameters.BlogID, blogID)];
                    case 1:
                        blog = _a.sent();
                        // check if the blog was not found
                        if (!blog) {
                            throw new NotFoundError_1.NotFoundError("Blog does not exist");
                        }
                        BASE_URL = process.env.BASE_URL;
                        if (blog.getTitleimagepath() !== null) {
                            //set path to the image from the Views directory [views are in /Views] using absolute paths
                            imagePath = BASE_URL + "/" + path_1.default.normalize(blog.getTitleimagepath());
                        }
                        else {
                            imagePath = "";
                        }
                        edit = req.query.editPage;
                        //check if client does not wants text/html
                        if (req.accepts('text/html') === 'text/html') {
                            //check the value of edit
                            if (edit !== undefined && edit !== "false") {
                                userID = { id: "" };
                                this.auth.setSubject(req.cookies["jwt"], userID);
                                //check if a userID was extracted from the incoming JWT
                                if (!userID.id.length) {
                                    //if not return because there is no way to verify if the incoming user owns the blog they want to edit
                                    throw new ForbiddenError_1.ForbiddenError("User does not have access to this blog resource");
                                }
                                //check if the incoming userID matches the username of the blog's owner -- only owners can edit their blog
                                if (userID.id === blog.getUsername()) {
                                    //render the edit blog template
                                    res.render('EditBlog', {
                                        titleImagePath: imagePath,
                                        title: blog.getTitle(),
                                        username: blog.getUsername(),
                                        content: blog.getContent(),
                                        BASE_URL: BASE_URL
                                    });
                                    return [2 /*return*/];
                                }
                                else {
                                    //user does not have access
                                    throw new ForbiddenError_1.ForbiddenError("User does not have access to this blog resource");
                                }
                            }
                            else {
                                //render the viewable blog template with the blog's properties
                                res.render('Blog', {
                                    titleImagePath: imagePath,
                                    title: blog.getTitle(),
                                    username: blog.getUsername(),
                                    content: blog.getContent(),
                                    BASE_URL: BASE_URL
                                });
                            }
                            //check if user wants to view the blog in a json representa
                        }
                        else if (req.accepts('application/json') === 'application/json') {
                            //if so send json representation of their 
                            res.status(200).send({
                                titleImagePath: imagePath,
                                title: blog.getTitle(),
                                username: blog.getUsername(),
                                content: blog.getContent()
                            });
                        }
                        else { //no accepted representation
                            throw new NotAcceptableError_1.NotAcceptableError();
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        //create a blog resource --return blogID 
        //A blog resource contains a path to the blog's title image if one was uploaded.
        //Body parameters: title, content
        //Accept: application/json
        //Response Content Type: Application/json
        // 12/15/20 New error handling middleware will catch and log errors + async routes in express-async-errors throws automatically so removed try catch block
        this.router.post('/blogs', this.auth.authenitcateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var blog, username, content, title, blogID, BASE_URL;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //check if the request's Accept header matches the response Content Type header
                        if (!req.accepts("application/json")) {
                            throw new NotAcceptableError_1.NotAcceptableError();
                        }
                        blog = new Blog_1.default();
                        username = res.locals.userId;
                        content = req.body.content;
                        title = req.body.title;
                        // validate the request properties
                        if (content === undefined || title === undefined) {
                            throw new BadRequestError_1.BadRequestError();
                        }
                        //set the username -- foreign key for the Blog entity that connects it to the User entity
                        blog.setUsername(username);
                        //set the content of the blog
                        blog.setContent(content);
                        //set the title of the blog
                        blog.setTitle(title);
                        return [4 /*yield*/, this.repo.create(blog)];
                    case 1:
                        blogID = _a.sent();
                        BASE_URL = process.env.BASE_URL;
                        //return the blog id to the user
                        res.status(201).location(BASE_URL + "/blogs/" + blogID).send({ blogID: blogID });
                        return [2 /*return*/];
                }
            });
        }); });
        //patch a blog resource
        //Body Parameters: content, titleImagePath, title
        //Accept: application/json
        //Response Content Type: application/json
        // 12/15/20 New error handling middleware will catch and log errors + async routes in express-async-errors throws automatically so removed try catch block
        this.router.patch('/blogs/:blogID', this.auth.authenitcateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userID, blogid, title, content, titleimagepath, blog, blogidNumber;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //ensure request accept header matches the response Content Type header
                        if (req.accepts('application/json') === false) {
                            throw new NotAcceptableError_1.NotAcceptableError();
                        }
                        userID = res.locals.userId;
                        blogid = req.params.blogID;
                        title = req.body.title;
                        content = req.body.content;
                        titleimagepath = req.body.titleImagePath;
                        return [4 /*yield*/, this.repo.find(BlogSearchCriteria_1.searchParameters.BlogID, blogid)];
                    case 1:
                        blog = _a.sent();
                        if (!blog) {
                            throw new NotFoundError_1.NotFoundError("Blog does not exist");
                        }
                        //check if the user was not the one that created the blog
                        if (!blog.creator(userID)) {
                            //the user does not have authorization to edit this blog
                            throw new ForbiddenError_1.ForbiddenError("User does not have access to this blog resource for editing");
                        }
                        //determine which blog properties are being patched based off request body parameters
                        if (content !== undefined) {
                            blog.setContent(content);
                        }
                        //blog title
                        if (title !== undefined) {
                            blog.setTitle(title);
                        }
                        //blog's path to titleimage
                        if (titleimagepath !== undefined) {
                            blog.setTitleimagepath(titleimagepath);
                        }
                        blogidNumber = parseInt(blogid);
                        //check if blogidNumber is NaN
                        if (isNaN(blogidNumber)) {
                            throw new BadRequestError_1.BadRequestError(); // TODO: Make invalid input error
                        }
                        //set blog object's blogID using the incoming request parameter
                        blog.setBlogid(blogidNumber);
                        return [4 /*yield*/, this.repo.update(blog)];
                    case 2:
                        //update the corresponding blog -- properties not being patched stay as Blog object constructor defaults
                        blog = _a.sent();
                        //send no content success
                        res.status(200).send(blog);
                        return [2 /*return*/];
                }
            });
        }); });
        //register router with the app
        app.use(this.router);
    };
    return BlogController;
}());
exports.default = BlogController;
