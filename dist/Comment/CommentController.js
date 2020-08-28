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
        //TODO: Add parameter to allow for going to the previous page.
        this.router.get('/comments', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var blogid, reply, replyto, orderby, likes, commentid, comments, e_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        console.log("In comments route!");
                        blogid = parseInt(req.query.blog);
                        reply = req.query.reply;
                        replyto = req.query.replyto;
                        orderby = req.query.orderby;
                        likes = req.query.likes;
                        commentid = req.query.commentid;
                        //check if query parameters are valid
                        if (blogid === undefined || isNaN(blogid) || reply === undefined || replyto === undefined || orderby === undefined || likes === undefined || commentid === undefined) {
                            console.log("Yes");
                            //no query parameters or bad query parameters in set return
                            res.sendStatus(400); //client error in parameters
                            return [2 /*return*/];
                        }
                        comments = void 0;
                        if (!(blogid > 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.repo.findAll(blogid, (_a = (reply === "true")) !== null && _a !== void 0 ? _a : false, parseInt(replyto), orderby, parseInt(likes), parseInt(commentid))];
                    case 1:
                        //fetch the comments from the repo with the query paramaters
                        comments = _c.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.repo.findAll(0, (_b = (reply === "true")) !== null && _b !== void 0 ? _b : false, parseInt(replyto), orderby, parseInt(likes), parseInt(commentid))];
                    case 3:
                        // client is requesting general comments -- mark blogid as 0
                        comments = _c.sent();
                        _c.label = 4;
                    case 4:
                        console.log(comments);
                        //return the comments 
                        res.send(comments);
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
        this.router.get('/comments/:commentid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                }
                catch (e) {
                }
                return [2 /*return*/];
            });
        }); });
        //create a new comment resource and returnt the comment id
        //body parameters: content, username, reply, replyto
        this.router.post('/comments', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                }
                catch (e) {
                }
                return [2 /*return*/];
            });
        }); });
        //update a particular comment resource
        //body parameters: content, deleted, etc more detail when i get to it
        this.router.patch('comments/:commentid', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                }
                catch (e) {
                }
                return [2 /*return*/];
            });
        }); });
        //register the route
        app.use(this.router);
    };
    return CommentControler;
}());
exports.default = CommentControler;
