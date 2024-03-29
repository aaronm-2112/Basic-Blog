"use strict";
//Purpose: Dictate behaviour for the Comment model's views.
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
var Auth_1 = __importDefault(require("../Auth/Auth"));
var Comment_1 = __importDefault(require("./Comment"));
var express_1 = __importDefault(require("express"));
var CommentControler = /** @class */ (function () {
    function CommentControler(repo) {
        this.repo = repo;
        this.router = express_1.default.Router();
        this.auth = new Auth_1.default();
    }
    CommentControler.prototype.registerRoutes = function (app) {
        var _this = this;
        //retrive a set of comments that can belong to a particular blog 
        //or be a search for any comment without regard to what blog it belongs to.
        //query parameters: blog, reply, replyto, orderby, likes, commentid
        //replyto is 0 when the requested comments are not replies
        //By default it searches all comments for the most liked, top level comments
        //Accept: application/json
        //Response Content Type: application/json
        this.router.get('/comments', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var blogid, reply, replyto, orderby, likes, commentid, flip, comments, e_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        //ensure header is application/json
                        if (req.accepts('application/json') === false) {
                            res.sendStatus(406);
                            return [2 /*return*/];
                        }
                        blogid = parseInt(req.query.blog) || 0;
                        reply = req.query.reply || "false";
                        replyto = req.query.replyto || "0";
                        orderby = req.query.orderby || "likes";
                        likes = req.query.likes || "1000";
                        commentid = parseInt(req.query.commentid) || 1000;
                        flip = req.query.flip || "next";
                        //check if query parameters are valid
                        if (blogid === undefined || isNaN(blogid) || reply === undefined || replyto === undefined || orderby === undefined || likes === undefined || commentid === undefined || flip === undefined, isNaN(commentid)) {
                            //no query parameters or bad query parameters in set return
                            res.sendStatus(400); //client error in parameters
                            return [2 /*return*/];
                        }
                        comments = void 0;
                        if (!(blogid > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.repo.findAll(blogid, (_a = (reply === "true")) !== null && _a !== void 0 ? _a : false, parseInt(replyto), orderby, parseInt(likes), commentid, flip)];
                    case 1:
                        //fetch the comments from the repo with the query paramaters
                        comments = _c.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.repo.findAll(0, (_b = (reply === "true")) !== null && _b !== void 0 ? _b : false, parseInt(replyto), orderby, parseInt(likes), commentid, flip)];
                    case 3:
                        // client is requesting general comments -- mark blogid as 0
                        comments = _c.sent();
                        _c.label = 4;
                    case 4:
                        //return the comments 
                        res.status(200).send(comments);
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _c.sent();
                        res.sendStatus(400);
                        console.log(e_1);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); });
        //retrieve a particular comment resource
        //Accept: application/json
        //Response Content Type: application/json
        this.router.get('/comments/:commentid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var cid, comment, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (req.accepts('application/json') === false) {
                            res.sendStatus(406);
                            return [2 /*return*/];
                        }
                        cid = parseInt(req.params.commentid);
                        //verify the commentid is valid
                        if (cid <= 0 || isNaN(cid) || cid === undefined) {
                            res.sendStatus(400);
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.repo.find(cid)];
                    case 1:
                        comment = _a.sent();
                        //return the comment data back to the user
                        res.status(200).send(comment);
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        res.sendStatus(400);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        //create a new comment resource and returnt the comment id
        //body parameters: content, reply, replyto, blogid
        //Accept: application/json
        //Response Content Type: application/json
        this.router.post('/comments', this.auth.authenitcateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var reply, replyto, content, blogid, username, comment, commentid, BASE_URL, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        if (req.accepts("application/json") === false) {
                            res.sendStatus(406);
                            return [2 /*return*/];
                        }
                        reply = req.body.reply;
                        replyto = parseInt(req.body.replyto);
                        content = req.body.content;
                        blogid = parseInt(req.body.blogid);
                        //verify the boolean is a boolean
                        if (reply !== true && reply !== false) {
                            res.sendStatus(400);
                            return [2 /*return*/];
                        }
                        //check if body parameters are valid
                        if (blogid === undefined || isNaN(blogid) || reply === undefined || replyto === undefined || content == undefined || isNaN(replyto)) {
                            //no query parameters or bad query parameters in set return
                            res.sendStatus(400); //client error in parameters
                            return [2 /*return*/];
                        }
                        username = res.locals.userId;
                        comment = new Comment_1.default();
                        comment.setUsername(username);
                        comment.setBlogid(blogid);
                        comment.setLikes(0); //0 likes because comment is being created
                        comment.setDeleted(false); //comment is being created
                        comment.setReply(reply);
                        comment.setReplyto(replyto);
                        comment.setContent(content);
                        return [4 /*yield*/, this.repo.create(comment)];
                    case 1:
                        commentid = _a.sent();
                        BASE_URL = process.env.BASE_URL;
                        //return the commentid
                        res.status(201).location(BASE_URL + "/comments/" + commentid).send({ commentid: commentid });
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        console.log(e_3);
                        res.sendStatus(400);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        //update a particular comment resource - used for adding likes to a comment, editing comment text, marking as deleted
        //A user can only like a particular comment one time. Deleted comments cannot be edited.
        //Body parameters: content, like, deleted
        //Feels like a mixture of PUT and PATCH b/c the entire comment resource is being updated, howewver it is guranteed to only change 
        //the values the client passes into the body and is a cleaner implementation than my patches in the User and Blog controllers.
        //Accept: application/json
        //Response Content Type: application/json
        this.router.patch('/comments/:commentid', this.auth.authenitcateJWT, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var cid, comment, username, content, deleted, like, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        cid = parseInt(req.params.commentid);
                        //check if comment is NaN
                        if (isNaN(cid)) {
                            //send back 400 
                            res.sendStatus(400);
                            //stop function execution
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.repo.find(cid)];
                    case 1:
                        comment = _a.sent();
                        username = res.locals.userId;
                        content = req.body.content;
                        deleted = req.body.deleted;
                        like = req.body.like;
                        //check if content is a string
                        if (typeof content === 'string') {
                            //edit the comment content
                            comment.editContent(username, content);
                        }
                        //determine if user wants to add a like to the comment
                        if (typeof like === 'boolean' && like !== false) {
                            //check if adding the like was not successful
                            comment.addLike(username);
                        }
                        //determine if user wants to mark the incoming comment as deleted
                        if (typeof deleted === 'boolean' && deleted === true) {
                            //attempt to mark the comment as deleted
                            comment.markDeleted(username);
                        }
                        return [4 /*yield*/, this.repo.update(comment)];
                    case 2:
                        //update the comment with the comment repo
                        comment = _a.sent();
                        //send back successful status code 200
                        res.status(200).send(comment);
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _a.sent();
                        e_4 === "Client does not own the comment" ? res.sendStatus(403) : res.sendStatus(400);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); });
        //register the route
        app.use(this.router);
    };
    return CommentControler;
}());
exports.default = CommentControler;
