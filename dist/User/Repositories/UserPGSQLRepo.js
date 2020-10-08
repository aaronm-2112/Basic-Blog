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
var pg_1 = require("pg");
var User_1 = __importDefault(require("../User"));
var salt_1 = require("../../Common/salt");
var UserPGSQLRepo = /** @class */ (function () {
    function UserPGSQLRepo(connectionObj) {
        //create the connection pool
        this.pool = new pg_1.Pool({
            user: connectionObj.getUser(),
            host: connectionObj.getHost(),
            database: connectionObj.getDatabase(),
            password: connectionObj.getPassword(),
            port: connectionObj.getPort()
        });
    }
    //TODO: use search criteria and searchby values
    UserPGSQLRepo.prototype.find = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var query, values, result, rows, user_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        query = "SELECT * FROM users WHERE username = $1";
                        values = new Array();
                        values.push(username);
                        return [4 /*yield*/, this.pool.query(query, values)];
                    case 1:
                        result = _a.sent();
                        rows = result.rows;
                        if (!rows.length) {
                            throw new Error("Not found");
                        }
                        user_1 = new User_1.default();
                        // fill out the user object and return it
                        rows.forEach(function (row) {
                            user_1.setUserid(row["userid"]);
                            user_1.setEmail(row["email"]);
                            user_1.setBio(row["bio"]);
                            user_1.setFirstname(row["firstname"]);
                            user_1.setLastname(row["lastname"]);
                            user_1.setUsername(row["username"]);
                            user_1.setPassword(row["password"]);
                            user_1.setProfilePicPath(row["profilepic"]);
                        });
                        //return the user value
                        return [2 /*return*/, user_1];
                    case 2:
                        e_1 = _a.sent();
                        throw new Error(e_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserPGSQLRepo.prototype.create = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var salt, hash, query, values, result, userid, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, salt_1.generateUserSalt()];
                    case 1:
                        salt = _a.sent();
                        //set user's salt
                        user.setSalt(salt);
                        return [4 /*yield*/, salt_1.generateUserHash(user.getPassword(), salt)];
                    case 2:
                        hash = _a.sent();
                        //set the user's hash 
                        user.setPassword(hash);
                        query = "INSERT INTO users (username, password, email, firstname, lastname, bio, salt, profilepic) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING userid;";
                        values = new Array();
                        values.push(user.getUsername());
                        values.push(user.getPassword());
                        values.push(user.getEmail());
                        values.push(user.getFirstname());
                        values.push(user.getLastname());
                        values.push(user.getBio());
                        values.push(user.getSalt());
                        values.push(user.getProfilePicPath());
                        return [4 /*yield*/, this.pool.query(query, values)];
                    case 3:
                        result = _a.sent();
                        userid = result.rows[0]["userid"];
                        //send the userid
                        return [2 /*return*/, userid];
                    case 4:
                        e_2 = _a.sent();
                        throw new Error(e_2);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserPGSQLRepo.prototype.update = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var queryProperties, queryValues, userEntries, parameterNumber, entry, query, result, rows, row, updatedUser, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        queryProperties = [];
                        queryValues = [];
                        userEntries = Object.entries(user);
                        parameterNumber = 1;
                        //traverse the blog's entries
                        for (entry in userEntries) {
                            //determine which user properties need to be updated -- and do not update those which can't be
                            if (userEntries[entry][0] !== 'username' && userEntries[entry][1] !== "" && userEntries[entry][0] !== 'salt' && userEntries[entry][0] !== 'userid' && userEntries[entry][0] !== 'email' && typeof (userEntries[entry][1]) !== 'function') { //empty string not acceptable update value
                                //push the blog property into the list of query properties -- add '= ?' to ready the prepared statement
                                queryProperties.push(userEntries[entry][0] + (" = $" + parameterNumber));
                                //push the blog property value into the list of query values
                                queryValues.push(userEntries[entry][1]);
                                //increment parameter value
                                parameterNumber += 1;
                            }
                        }
                        query = "UPDATE users SET " + queryProperties.join(',') + (" WHERE username = $" + parameterNumber + " RETURNING *");
                        //add the username to the collection of query values
                        queryValues.push(user.getUsername());
                        return [4 /*yield*/, this.pool.query(query, queryValues)];
                    case 1:
                        result = _a.sent();
                        rows = result.rows;
                        if (!rows.length) {
                            throw new Error("Not found");
                        }
                        row = rows[0];
                        updatedUser = new User_1.default();
                        updatedUser.setUserid(row.userid);
                        updatedUser.setProfilePicPath(row.profilepic);
                        updatedUser.setEmail(row.email);
                        updatedUser.setFirstname(row.firstname);
                        updatedUser.setLastname(row.lastname);
                        updatedUser.setUsername(row.username);
                        updatedUser.setBio(row.bio);
                        updatedUser.setPassword(row.password);
                        return [2 /*return*/, updatedUser];
                    case 2:
                        e_3 = _a.sent();
                        throw new Error(e_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserPGSQLRepo.prototype.delete = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, true];
            });
        });
    };
    return UserPGSQLRepo;
}());
exports.default = UserPGSQLRepo;
