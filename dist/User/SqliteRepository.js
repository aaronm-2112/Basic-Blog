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
var sqlite_1 = require("sqlite");
var sqlite3_1 = __importDefault(require("sqlite3"));
var User_1 = __importDefault(require("../Models/User"));
var salt_1 = require("../Common/salt");
var UserSQLLiteRepo = /** @class */ (function () {
    function UserSQLLiteRepo() {
        this.dbPath = "C:\\Users\\Aaron\\Desktop\\Basic-Blog\\dist\\blog.db";
    }
    UserSQLLiteRepo.prototype.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var db, allUserRows, users_1, user_1, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, sqlite_1.open({
                                filename: "" + this.dbPath,
                                driver: sqlite3_1.default.Database
                            })
                            // get all users in the table
                        ];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.all("SELECT * from User")];
                    case 2:
                        allUserRows = _a.sent();
                        //close the databse connection
                        return [4 /*yield*/, db.close()
                            // create a users array with the resulting user rows
                        ];
                    case 3:
                        //close the databse connection
                        _a.sent();
                        users_1 = [];
                        user_1 = new User_1.default();
                        allUserRows.forEach(function (row) {
                            user_1.setEmail(row["email"]);
                            user_1.setBio(row["bio"]);
                            user_1.setFirstname(row["firstname"]);
                            user_1.setLastname(row["lastname"]);
                            user_1.setUsername(row["username"]);
                            user_1.setPassword(row["password"]);
                            users_1.push(user_1);
                        });
                        return [2 /*return*/, users_1];
                    case 4:
                        e_1 = _a.sent();
                        throw new Error(e_1);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserSQLLiteRepo.prototype.find = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            var db, row, user, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, sqlite_1.open({
                                filename: "" + this.dbPath,
                                driver: sqlite3_1.default.Database
                            })
                            // use the email to acquire the user properties
                        ];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.get("SELECT * FROM User WHERE username = '" + username + "'")];
                    case 2:
                        row = _a.sent();
                        //close the database
                        return [4 /*yield*/, db.close()];
                    case 3:
                        //close the database
                        _a.sent();
                        user = new User_1.default();
                        user.setEmail(row["email"]);
                        user.setBio(row["bio"]);
                        user.setFirstname(row["firstname"]);
                        user.setLastname(row["lastname"]);
                        user.setUsername(row["username"]);
                        user.setPassword(row["password"]);
                        return [2 /*return*/, user];
                    case 4:
                        e_2 = _a.sent();
                        throw new Error(e_2);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    UserSQLLiteRepo.prototype.create = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var db, salt, hash, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, sqlite_1.open({
                                filename: "" + this.dbPath,
                                driver: sqlite3_1.default.Database
                            })
                            //Generate a salt for the user
                        ];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, salt_1.generateUserSalt()];
                    case 2:
                        salt = _a.sent();
                        //set user's salt
                        user.setSalt(salt);
                        return [4 /*yield*/, salt_1.generateUserHash(user.getPassword(), salt)];
                    case 3:
                        hash = _a.sent();
                        //TODO: Maybe don't do it this way
                        user.setPassword(hash);
                        // Insert the user properties into the User table
                        return [4 /*yield*/, db.exec("Insert INTO User (username, password, email, firstname, lastname, bio, salt) VALUES ('" + user.getUsername() + "', '" + user.getPassword() + "', '" + user.getEmail() + "', '" + user.getFirstname() + "', '" + user.getLastname() + "', '" + user.getBio() + "', '" + user.getSalt() + "')")];
                    case 4:
                        // Insert the user properties into the User table
                        _a.sent();
                        //close the db connection
                        return [4 /*yield*/, db.close()];
                    case 5:
                        //close the db connection
                        _a.sent();
                        //return a success
                        return [2 /*return*/, true];
                    case 6:
                        e_3 = _a.sent();
                        // TODO: Shows too much information about the database so change the error
                        throw new Error(e_3);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    //Behind firewall -- assume all input is valid at this point but use prepared statements
    //TODO: Allow password and email changes and make more robust
    UserSQLLiteRepo.prototype.update = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var db, statement, updatedUser, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, sqlite_1.open({
                                filename: "" + this.dbPath,
                                driver: sqlite3_1.default.Database
                            })
                            //Update all fields except for password, salt, or email 
                        ];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.prepare("UPDATE User SET firstname = ?, lastname = ?, bio = ? WHERE username = ?")];
                    case 2:
                        statement = _a.sent();
                        //TODO: Implement this in a more robust manner
                        return [4 /*yield*/, statement.run(user.getFirstname(), user.getLastname(), user.getBio(), user.getUsername())];
                    case 3:
                        //TODO: Implement this in a more robust manner
                        _a.sent();
                        return [4 /*yield*/, this.find(user.getUsername())];
                    case 4:
                        updatedUser = _a.sent();
                        console.log(updatedUser);
                        return [4 /*yield*/, statement.finalize()];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        e_4 = _a.sent();
                        throw new Error(e_4);
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UserSQLLiteRepo.prototype.delete = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var db, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, sqlite_1.open({
                                filename: "" + this.dbPath,
                                driver: sqlite3_1.default.Database
                            })
                            //query the database for the given email and delete the match
                        ];
                    case 1:
                        db = _a.sent();
                        //query the database for the given email and delete the match
                        return [4 /*yield*/, db.exec("DELETE FROM User WHERE email = '" + email + "'")];
                    case 2:
                        //query the database for the given email and delete the match
                        _a.sent();
                        // no database error so return true
                        return [2 /*return*/, true];
                    case 3:
                        e_5 = _a.sent();
                        throw new Error(e_5);
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return UserSQLLiteRepo;
}());
exports.default = UserSQLLiteRepo;
