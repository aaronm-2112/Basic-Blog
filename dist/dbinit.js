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
//Purpose: Initialize the database (whether the Database be PGSQL or other)
//How: Each differing database will have its own createDB function. As of now the naming does not reflect this.
var path_1 = __importDefault(require("path"));
var pg_1 = require("pg");
var dbPath = path_1.default.resolve(__dirname, 'blog.db');
function createDB(connectionObj) {
    return __awaiter(this, void 0, void 0, function () {
        var client, pgRes, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    client = new pg_1.Client({
                        user: connectionObj.getUser(),
                        host: connectionObj.getHost(),
                        database: connectionObj.getDatabase(),
                        password: connectionObj.getPassword(),
                        port: connectionObj.getPort()
                    });
                    return [4 /*yield*/, client.connect()];
                case 1:
                    _a.sent();
                    pgRes = void 0;
                    return [4 /*yield*/, client.query("DROP TABLE users CASCADE").catch(function (e) { return console.log("OOps"); })];
                case 2:
                    //drop the tables if they exist
                    pgRes = _a.sent();
                    return [4 /*yield*/, client.query('DROP TABLE blogs CASCADE').catch(function (e) { return console.log("OOps"); })];
                case 3:
                    pgRes = _a.sent();
                    return [4 /*yield*/, client.query("DROP TABLE comments CASCADE").catch(function (e) { return console.log("OOps"); })];
                case 4:
                    pgRes = _a.sent();
                    return [4 /*yield*/, client.query("CREATE TABLE users (\n        userid serial primary key,\n        username text not null unique,\n        password text not null,\n        email text not null unique,\n        firstname text,\n        lastname text,\n        bio text,\n        salt text, \n        profilepic text\n    );")];
                case 5:
                    //create the tables----------------------------------
                    //TABLE users
                    pgRes = _a.sent();
                    return [4 /*yield*/, client.query("CREATE TABLE blogs ( \n        blogid serial primary key, \n        username text not null, \n        title text not null, \n        content text, \n        titleimagepath text, \n        foreign key(username) references users(username));")];
                case 6:
                    //TABLE blogs
                    pgRes = _a.sent();
                    return [4 /*yield*/, client.query("CREATE TABLE comments ( \n        commentid serial primary key, \n        username text not null, \n        blogid integer not null, \n        content text not null, \n        reply boolean not null, \n        replyto integer not null, \n        likes integer not null, \n        likedby text[], \n        deleted boolean not null, \n        created timestamp default current_timestamp, \n        foreign key(username) references users(username), \n        foreign key(blogid) references blogs(blogid));")
                        //end the client's connection
                    ];
                case 7:
                    //TABLE comments
                    pgRes = _a.sent();
                    //end the client's connection
                    return [4 /*yield*/, client.end()];
                case 8:
                    //end the client's connection
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.createDB = createDB;
//Test data that is used for database testing
function populateDBWithTestData(connectionObj) {
    return __awaiter(this, void 0, void 0, function () {
        var client, pgRes, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    client = new pg_1.Client({
                        user: connectionObj.getUser(),
                        host: connectionObj.getHost(),
                        database: connectionObj.getDatabase(),
                        password: connectionObj.getPassword(),
                        port: connectionObj.getPort()
                    });
                    return [4 /*yield*/, client.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client.query("INSERT INTO users (userid, username, password, email, firstname, lastname, bio, salt, profilepic) \n                                VALUES ('2', 'First User', '1234', 'aaron.m@gmail.com', 'aaron', 'g', 'my bio', '#r4', '/uploads/1234' )")];
                case 2:
                    pgRes = _a.sent();
                    return [4 /*yield*/, client.query("INSERT INTO blogs (blogid, username, title, content, titleimagepath) \n                                VALUES ('1', 'First User', 'Blog One', 'First blog', '/uploads/1233')")];
                case 3:
                    //insert a test blog
                    pgRes = _a.sent();
                    return [4 /*yield*/, client.query("INSERT INTO comments ( commentid, username, blogid, content, reply, replyto, likes, created, deleted)\n                                VALUES ('2','First User', '1', 'Good blog!', 'false', '0', '0', '2000-12-31','false')")];
                case 4:
                    //insert a test comment
                    pgRes = _a.sent();
                    //end the client's connection
                    return [4 /*yield*/, client.end()];
                case 5:
                    //end the client's connection
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_2 = _a.sent();
                    console.log(e_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.populateDBWithTestData = populateDBWithTestData;
