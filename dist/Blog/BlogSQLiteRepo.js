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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Blog_1 = __importDefault(require("./Blog"));
var sqlite_1 = require("sqlite");
var sqlite3_1 = __importDefault(require("sqlite3"));
//purpose: perform basic crud ops with the blog table using sqlite.Used in controllers. Decouples database layer from higher level modules.
var BlogSQLiteRepo = /** @class */ (function () {
    function BlogSQLiteRepo() {
        this.dbPath = "C:\\Users\\Aaron\\Desktop\\Basic-Blog\\dist\\blog.db";
    }
    //find all blogs using a certain search criteria 
    BlogSQLiteRepo.prototype.findAll = function (searchBy, value) {
        return __awaiter(this, void 0, void 0, function () {
            var db, statement, rows, blogs_1, blog_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, sqlite_1.open({
                                filename: "" + this.dbPath,
                                driver: sqlite3_1.default.Database
                            })
                            //prepare the blog search query as a prepared statement
                        ];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.prepare("SELECT blogID, username, title, content, titleImagePath FROM Blog WHERE " + searchBy + " = ? ")];
                    case 2:
                        statement = _a.sent();
                        return [4 /*yield*/, statement.all(value)];
                    case 3:
                        rows = _a.sent();
                        blogs_1 = [];
                        //place results into the blog array 
                        rows.forEach(function (row) {
                            blog_1 = new Blog_1.default(); //TODO: Find better way to create a deep copy
                            blog_1.blogID = row.blogID;
                            blog_1.title = row.title;
                            blog_1.titleImagePath = row.titleImagePath;
                            blog_1.username = row.username;
                            blog_1.content = row.content;
                            //push blog into blog array 
                            blogs_1.push(blog_1);
                        });
                        //finalize statement -- can skip this
                        statement.finalize();
                        //close db
                        return [4 /*yield*/, db.close()];
                    case 4:
                        //close db
                        _a.sent();
                        //return the results to the client 
                        return [2 /*return*/, blogs_1];
                    case 5:
                        e_1 = _a.sent();
                        console.log(e_1);
                        throw new Error(e_1);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    BlogSQLiteRepo.prototype.find = function (searchBy, value) {
        return __awaiter(this, void 0, void 0, function () {
            var db, statement, row, blog, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        console.log("In find");
                        return [4 /*yield*/, sqlite_1.open({
                                filename: "" + this.dbPath,
                                driver: sqlite3_1.default.Database
                            })];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.prepare("SELECT blogID, username, title, content, titleImagePath FROM Blog WHERE " + searchBy + " = ?")];
                    case 2:
                        statement = _a.sent();
                        return [4 /*yield*/, statement.get(value)];
                    case 3:
                        row = _a.sent();
                        blog = new Blog_1.default();
                        blog.blogID = row.blogID;
                        blog.title = row.title;
                        blog.titleImagePath = row.titleImagePath;
                        blog.content = row.content;
                        blog.username = row.username;
                        //finalize the statement
                        statement.finalize();
                        //close the database connection
                        return [4 /*yield*/, db.close()];
                    case 4:
                        //close the database connection
                        _a.sent();
                        return [2 /*return*/, blog];
                    case 5:
                        e_2 = _a.sent();
                        throw new Error(e_2);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    BlogSQLiteRepo.prototype.create = function (blog) {
        return __awaiter(this, void 0, void 0, function () {
            var db, statement, result, rowID, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, sqlite_1.open({
                                filename: "" + this.dbPath,
                                driver: sqlite3_1.default.Database
                            })
                            //prepare the insert statement 
                        ];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.prepare("INSERT INTO Blog ( username, title, content, titleImagePath) VALUES (?, ?, ?, ?)")];
                    case 2:
                        statement = _a.sent();
                        return [4 /*yield*/, statement.run(blog.username, blog.title, blog.content, blog.titleImagePath)];
                    case 3:
                        result = _a.sent();
                        console.log(result);
                        rowID = result.lastID;
                        //finalize statmenet
                        return [4 /*yield*/, statement.finalize()];
                    case 4:
                        //finalize statmenet
                        _a.sent();
                        //close db
                        return [4 /*yield*/, db.close()];
                    case 5:
                        //close db
                        _a.sent();
                        //return database
                        return [2 /*return*/, rowID];
                    case 6:
                        e_3 = _a.sent();
                        console.log(e_3);
                        return [2 /*return*/, -1];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    //upddate any changes that occur to the blog. Do not update BlogID
    BlogSQLiteRepo.prototype.update = function (blog) {
        return __awaiter(this, void 0, void 0, function () {
            var db, queryProperties, queryValues, blogEntries, entry, query, statement, blogID, result, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        console.log("In update");
                        //check if blogID is filled
                        if (blog.blogID < 0) {
                            throw new Error("No ID");
                        }
                        return [4 /*yield*/, sqlite_1.open({
                                filename: "" + this.dbPath,
                                driver: sqlite3_1.default.Database
                            })];
                    case 1:
                        db = _a.sent();
                        queryProperties = [];
                        queryValues = [];
                        blogEntries = Object.entries(blog);
                        //traverse the blog's entries
                        for (entry in blogEntries) {
                            //determine which blog properties need to be updated
                            if (blogEntries[entry][1] !== undefined && blogEntries[entry][1] !== null && blogEntries[entry][0] !== 'blogID' && blogEntries[entry][1] !== "") { //empty string not acceptable update value
                                //push the blog property into the list of query properties -- add '= ?' to ready the prepared statement
                                queryProperties.push(blogEntries[entry][0] + ' = ?');
                                //push the blog property value into the list of query values
                                queryValues.push(blogEntries[entry][1]);
                            }
                        }
                        query = "UPDATE BLOG SET " + queryProperties.join(',') + " WHERE blogID = ?";
                        console.log(query);
                        return [4 /*yield*/, db.prepare(query)];
                    case 2:
                        statement = _a.sent();
                        blogID = blog.blogID.toString();
                        return [4 /*yield*/, statement.run.apply(statement, __spreadArrays(queryValues, [blogID]))];
                    case 3:
                        result = _a.sent();
                        console.log(result);
                        //finalize statmenet
                        return [4 /*yield*/, statement.finalize()];
                    case 4:
                        //finalize statmenet
                        _a.sent();
                        //close db
                        return [4 /*yield*/, db.close()];
                    case 5:
                        //close db
                        _a.sent();
                        return [2 /*return*/];
                    case 6:
                        e_4 = _a.sent();
                        console.log(e_4);
                        throw new Error(e_4);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    BlogSQLiteRepo.prototype.delete = function (blog) {
        return __awaiter(this, void 0, void 0, function () {
            var db, statement, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, sqlite_1.open({
                                filename: "" + this.dbPath,
                                driver: sqlite3_1.default.Database
                            })
                            //prepare the blog deletion statement
                        ];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.prepare("DELETE FROM Blog WHERE blogID = ?")];
                    case 2:
                        statement = _a.sent();
                        //delete the blog 
                        return [4 /*yield*/, statement.run(blog.blogID)];
                    case 3:
                        //delete the blog 
                        _a.sent();
                        //finalize statement
                        statement.finalize();
                        //close database connection
                        return [4 /*yield*/, db.close()];
                    case 4:
                        //close database connection
                        _a.sent();
                        return [2 /*return*/, true];
                    case 5:
                        e_5 = _a.sent();
                        console.log(e_5);
                        return [2 /*return*/, false];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return BlogSQLiteRepo;
}());
exports.default = BlogSQLiteRepo;
