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
//Purpose: Something to create the database I want.
var sqlite3_1 = __importDefault(require("sqlite3"));
var sqlite_1 = require("sqlite");
var path_1 = __importDefault(require("path"));
var pg_1 = require("pg");
var dbPath = path_1.default.resolve(__dirname, 'blog.db');
function createDB() {
    return __awaiter(this, void 0, void 0, function () {
        var db, res, blogRes, client, pgRes, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 11, , 12]);
                    return [4 /*yield*/, sqlite_1.open({
                            filename: "C:\\Users\\Aaron\\Desktop\\Basic-Blog\\dist\\blog.db",
                            driver: sqlite3_1.default.Database
                        })];
                case 1:
                    db = _a.sent();
                    return [4 /*yield*/, db.exec('DROP TABLE User')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, db.exec('DROP TABLE Blog')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, db.exec('CREATE TABLE User (userID INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, email TEXT NOT NULL UNIQUE, firstname TEXT, lastname TEXT, bio TEXT, salt TEXT, profilePic TEXT)')];
                case 4:
                    res = _a.sent();
                    return [4 /*yield*/, db.exec('CREATE TABLE Blog (blogID INTEGER PRIMARY KEY AUTOINCREMENT, username INTEGER, title TEXT NOT NULL, content TEXT, titleImagePath TEXT, FOREIGN KEY(username) REFERENCES User(username))')];
                case 5:
                    blogRes = _a.sent();
                    return [4 /*yield*/, db.close()];
                case 6:
                    _a.sent();
                    client = new pg_1.Client({
                        user: 'postgres',
                        host: 'localhost',
                        database: 'blog',
                        password: 'cBKq#F!23JZQ9*:A',
                        port: 5432
                    });
                    return [4 /*yield*/, client.connect()];
                case 7:
                    _a.sent();
                    pgRes = void 0;
                    return [4 /*yield*/, client.query("DROP TABLE comments")];
                case 8:
                    //drop the tables if they exist
                    //pgRes = await client.query(`DROP TABLE users CASCADE`);
                    // console.log(pgRes);
                    //gRes = await client.query('DROP TABLE blogs');
                    // console.log(pgRes);
                    //create the tables
                    //TABLE users
                    // pgRes = await client.query(`CREATE TABLE users (
                    //     userid serial primary key,
                    //     username text not null unique,
                    //     password text not null,
                    //     email text not null unique,
                    //     firstname text,
                    //     lastname text,
                    //     bio text,
                    //     salt text, 
                    //     profilepic text
                    // );`);
                    //console.log(pgRes);
                    //TABLE blogs
                    // pgRes = await client.query(`CREATE TABLE blogs (blogid serial primary key, username text not null, title text not null, content text, titleimagepath text, foreign key(username) references users(username));`);
                    // console.log(pgRes);
                    //DROP TABLE comments
                    pgRes = _a.sent();
                    return [4 /*yield*/, client.query("CREATE TABLE comments (commentid serial primary key, username text not null, blogid integer not null, content text not null, reply boolean not null, replyto integer not null, likes integer not null, likedby text[], deleted boolean not null, created timestamp default current_timestamp, foreign key(username) references users(username), foreign key(blogid) references blogs(blogid));")];
                case 9:
                    //TABLE comments --TODO: No reply instead only use replyto?
                    pgRes = _a.sent();
                    console.log(pgRes);
                    //end the client's connection
                    return [4 /*yield*/, client.end()];
                case 10:
                    //end the client's connection
                    _a.sent();
                    return [3 /*break*/, 12];
                case 11:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.createDB = createDB;
