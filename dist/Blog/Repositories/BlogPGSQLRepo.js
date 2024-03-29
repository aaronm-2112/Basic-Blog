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
var Blog_1 = __importDefault(require("../Blog"));
var pg_1 = require("pg");
//purpose: perform basic crud ops with the blog table using postgresql.
//         Used in controllers. Decouples database layer from higher level modules.
//How it works: pool of connections is used to perform usercontroller requests on the blog data. Paramaterized queries are used for sql injection protection.
var BlogPGSQLRepo = /** @class */ (function () {
    function BlogPGSQLRepo(connectionObj) {
        //create the connection pool
        this.pool = new pg_1.Pool({
            user: connectionObj.getUser(),
            host: connectionObj.getHost(),
            database: connectionObj.getDatabase(),
            password: connectionObj.getPassword(),
            port: connectionObj.getPort()
        });
    }
    //find all blogs using a certain search criteria 
    //Uses the blogid to perform basic keyset pagination. Returns only 10 results per search.
    BlogPGSQLRepo.prototype.findAll = function (searchBy, searchByValue, key, keyCondition) {
        return __awaiter(this, void 0, void 0, function () {
            var query, values, result, rows, blogs_1, blog_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = void 0;
                        //determine query condition
                        if (keyCondition === '>') {
                            //analagous to getting the next set of results
                            query = "SELECT * FROM blogs WHERE " + searchBy + " = $1 AND blogid " + keyCondition + " " + key + " LIMIT 10";
                        }
                        else if (keyCondition === '<') {
                            //analagous to getting the previous results
                            //query = `SELECT * FROM blogs WHERE ${searchBy} = $1 AND blogid < ${key} AND blogid >= ${key} - 10 LIMIT 10`;
                            query = "SELECT * FROM blogs WHERE " + searchBy + " = $1 AND blogid < " + key + " ORDER BY blogid DESC LIMIT 10";
                        }
                        else {
                            throw new Error("Condition not acceptable");
                        }
                        values = [];
                        //add the search value to the value collection
                        values.push(searchByValue);
                        return [4 /*yield*/, this.pool.query(query, values)];
                    case 1:
                        result = _a.sent();
                        rows = result.rows;
                        blogs_1 = [];
                        //place results into the blog array 
                        rows.forEach(function (row) {
                            blog_1 = new Blog_1.default(); //TODO: Find better way to create a deep copy
                            blog_1.setBlogid(row.blogid);
                            blog_1.setTitle(row.title);
                            blog_1.setTitleimagepath(row.titleimagepath);
                            blog_1.setUsername(row.username);
                            blog_1.setContent(row.content);
                            //push blog into blog array 
                            blogs_1.push(blog_1);
                        });
                        //return the results to the client 
                        return [2 /*return*/, blogs_1];
                    case 2:
                        e_1 = _a.sent();
                        console.log(e_1);
                        throw new Error(e_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //return the resulting row that meets the search criteria
    //if a searchBy value returns more than one row, then only the first row values are returned to the client.
    BlogPGSQLRepo.prototype.find = function (searchBy, value) {
        return __awaiter(this, void 0, void 0, function () {
            var query, values, result, row, blog, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = "SELECT blogid, username, title, content, titleimagepath FROM blogs WHERE " + searchBy + " = $1";
                        values = [];
                        values.push(value);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.pool.query(query, values)];
                    case 2:
                        result = _a.sent();
                        // check if the result exists
                        if (!result.rows.length) {
                            // if no result return null
                            return [2 /*return*/, null];
                        }
                        row = result.rows[0];
                        blog = new Blog_1.default();
                        blog.setBlogid(row.blogid);
                        blog.setTitle(row.title);
                        blog.setTitleimagepath(row.titleimagepath);
                        blog.setContent(row.content);
                        blog.setUsername(row.username);
                        return [2 /*return*/, blog];
                    case 3:
                        e_2 = _a.sent();
                        throw new Error(e_2);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    BlogPGSQLRepo.prototype.create = function (blog) {
        return __awaiter(this, void 0, void 0, function () {
            var query, values, result, blogID, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "INSERT INTO blogs ( username, title, content) VALUES ($1, $2, $3) RETURNING blogid";
                        values = [];
                        values.push(blog.getUsername());
                        values.push(blog.getTitle());
                        values.push(blog.getContent());
                        return [4 /*yield*/, this.pool.query(query, values)];
                    case 1:
                        result = _a.sent();
                        blogID = result.rows[0]["blogid"];
                        //return database
                        return [2 /*return*/, blogID];
                    case 2:
                        e_3 = _a.sent();
                        throw new Error(e_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    //upddate any changes that occur to the blog. Do not update BlogID
    //TODO: Refactor the entries method as this will not work when properties are made private
    BlogPGSQLRepo.prototype.update = function (blog) {
        return __awaiter(this, void 0, void 0, function () {
            var queryProperties, queryValues, blogEntries, parameterNumber, entry, query, result, row, updatedBlog, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        //check if blogID is filled
                        if (blog.getBlogid() < 0) {
                            throw new Error("No ID");
                        }
                        queryProperties = [];
                        queryValues = [];
                        blogEntries = Object.entries(blog);
                        parameterNumber = 1;
                        //traverse the blog's entries
                        for (entry in blogEntries) {
                            //determine which blog properties need to be updated
                            if (blogEntries[entry][1] !== undefined && blogEntries[entry][1] !== null && blogEntries[entry][0] !== 'blogid' && blogEntries[entry][0] !== "username" && typeof (blogEntries[entry][1]) !== 'function') { //empty string not acceptable update value nor is a function (for getters and setters)
                                //push the blog property into the list of query properties -- add '= ?' to ready the prepared statement
                                queryProperties.push(blogEntries[entry][0] + (" = $" + parameterNumber));
                                //push the blog property value into the list of query values
                                queryValues.push(blogEntries[entry][1]);
                                //inc the param number
                                parameterNumber += 1;
                            }
                        }
                        query = "UPDATE blogs SET " + queryProperties.join(',') + (" WHERE blogid = $" + parameterNumber + " RETURNING *");
                        //add the blogID to the queryValues list
                        queryValues.push(blog.getBlogid().toString());
                        return [4 /*yield*/, this.pool.query(query, queryValues)];
                    case 1:
                        result = _a.sent();
                        if (!result.rows.length) {
                            throw new Error("Not found");
                        }
                        row = result.rows[0];
                        updatedBlog = new Blog_1.default();
                        updatedBlog.setUsername(row.username);
                        updatedBlog.setBlogid(row.blogid);
                        updatedBlog.setContent(row.content);
                        updatedBlog.setTitle(row.title);
                        updatedBlog.setTitleimagepath(row.titleimagepath);
                        return [2 /*return*/, updatedBlog];
                    case 2:
                        e_4 = _a.sent();
                        throw new Error(e_4);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return BlogPGSQLRepo;
}());
exports.default = BlogPGSQLRepo;
