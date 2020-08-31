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
var Comment_1 = __importDefault(require("../Comment"));
var pg_1 = require("pg");
var CommentPGSQLRepo = /** @class */ (function () {
    function CommentPGSQLRepo() {
        //create the connection pool
        this.pool = new pg_1.Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASS,
            port: parseInt(process.env.DB_PORT)
        });
    }
    //returns comments(replies or top level) ordered by likes or date and cid
    CommentPGSQLRepo.prototype.findAll = function (blogid, reply, replyTo, orderBy, likes, cid) {
        return __awaiter(this, void 0, void 0, function () {
            var query, queryValues, parameterNumber, res, rows, comments_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        queryValues = [];
                        parameterNumber = 0;
                        //check if client wants comments from a particular blog
                        if (blogid > 0) {
                            //add blogid parameter to the base query
                            query = "SELECT * FROM comments WHERE blogid = $" + (parameterNumber += 1) + " AND ";
                            //add the blogid query value
                            queryValues.push(blogid);
                        }
                        else {
                            //construct base query without blogid parameter
                            query = "SELECT * FROM comments WHERE ";
                        }
                        //determine if comment is a reply or a top level comment
                        if (reply) {
                            //check if requesting replies ordered by date
                            if (orderBy === 'date') {
                                //construct query that returns replies using the date as the primary means of ordering
                                query = query + ("replyto = $" + (parameterNumber += 1) + " AND commentid > $" + (parameterNumber += 1) + " ORDER BY created ASC, commentid ASC LIMIT 10");
                                //add the query values
                                queryValues.push(replyTo);
                                queryValues.push(cid);
                            }
                            else { //return replies ordered by likes
                                //construct query 
                                query = query + ("replyto = $" + (parameterNumber += 1) + " AND (likes, commentid) < ($" + (parameterNumber += 1) + ", $" + (parameterNumber += 1) + ")  ORDER BY likes DESC, commentid DESC LIMIT 10");
                                //add the query values to the query values collection
                                queryValues.push(replyTo);
                                queryValues.push(likes);
                                queryValues.push(cid);
                            }
                        }
                        else { //return top level comments not replies
                            //construct query that return top level comments by likes
                            query = query + ("reply = false AND (likes, commentid) < ($" + (parameterNumber += 1) + ", $" + (parameterNumber += 1) + ")  ORDER BY likes DESC, commentid DESC LIMIT 10");
                            queryValues.push(likes);
                            queryValues.push(cid);
                        }
                        console.log(queryValues);
                        console.log(query);
                        return [4 /*yield*/, this.pool.query(query, queryValues)];
                    case 1:
                        res = _a.sent();
                        rows = res.rows;
                        comments_1 = [];
                        //fill comments with row values
                        rows.forEach(function (row) {
                            //populate a comment object
                            var comment = new Comment_1.default();
                            comment.commentid = row.commentid;
                            comment.username = row.username;
                            comment.blogid = row.blogid;
                            comment.content = row.content;
                            comment.reply = row.reply;
                            comment.replyto = row.replyto;
                            comment.likes = row.likes;
                            comment.deleted = row.deleted;
                            comment.created = row.created;
                            //add the comment object to the comments collection
                            comments_1.push(comment);
                            console.log(row);
                        });
                        //return the results
                        return [2 /*return*/, comments_1];
                    case 2:
                        e_1 = _a.sent();
                        throw new Error(e_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //TODO: Make values array more typescript. 
    CommentPGSQLRepo.prototype.create = function (comment) {
        return __awaiter(this, void 0, void 0, function () {
            var query, values, result, commentid, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "INSERT INTO comments ( username, blogid, content, reply, replyto, likes, deleted)  VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING commentid";
                        values = new Array();
                        values.push(comment.username);
                        values.push(comment.blogid);
                        values.push(comment.content);
                        values.push(comment.reply);
                        values.push(comment.replyto);
                        values.push(comment.likes);
                        values.push(comment.deleted);
                        return [4 /*yield*/, this.pool.query(query, values)];
                    case 1:
                        result = _a.sent();
                        console.log(result);
                        commentid = result.rows[0]["commentid"];
                        console.log(commentid);
                        //returnt the comment id
                        return [2 /*return*/, commentid];
                    case 2:
                        e_2 = _a.sent();
                        throw new Error(e_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return CommentPGSQLRepo;
}());
exports.default = CommentPGSQLRepo;
