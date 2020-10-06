"use strict";
//Purpose: Basic tests to look for PGSQL User repository queries for errors.
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
var UserPGSQLRepo_1 = __importDefault(require("../../User/Repositories/UserPGSQLRepo"));
var User_1 = __importDefault(require("../../User/User"));
var dbinit_1 = require("../../dbinit");
var PGConnection_1 = __importDefault(require("../../Common/PGConnection"));
var utils_1 = require("ts-jest/utils");
jest.mock('../../Common/PGConnection');
jest.mock('../../User/User');
describe("PGSQL User repository testing suite", function () {
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    utils_1.mocked(User_1.default).mockClear();
                    return [4 /*yield*/, dbinit_1.resetDB(mockConnectionObject)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, dbinit_1.createDB(mockConnectionObject)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, dbinit_1.populateDBWithTestData(mockConnectionObject)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test("Find returns the user that matches the given username", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, mockuser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new UserPGSQLRepo_1.default(mockConnectionObject);
                    return [4 /*yield*/, repo.find("First User")];
                case 1:
                    mockuser = _a.sent();
                    expect(mockuser.setUsername).toHaveBeenCalledWith("First User");
                    expect(mockuser.setPassword).toHaveBeenCalledWith("1234");
                    expect(mockuser.setEmail).toHaveBeenCalledWith("aaron.m@gmail.com");
                    expect(mockuser.setFirstname).toHaveBeenCalledWith("aaron");
                    expect(mockuser.setLastname).toHaveBeenCalledWith("g");
                    expect(mockuser.setBio).toHaveBeenCalledWith("my bio");
                    expect(mockuser.setProfilePicPath).toHaveBeenCalledWith("/uploads/1234");
                    return [2 /*return*/];
            }
        });
    }); });
    test("Find throws an error when no user exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new UserPGSQLRepo_1.default(mockConnectionObject);
                    return [4 /*yield*/, expect(repo.find("No User")).rejects.toThrow("Error: Not found")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test("Create works", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, mockuser, userid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new UserPGSQLRepo_1.default(mockConnectionObject);
                    mockuser = new User_1.default();
                    return [4 /*yield*/, repo.create(mockuser)];
                case 1:
                    userid = _a.sent();
                    expect(userid).toBeGreaterThan(1);
                    expect(mockuser.getUsername()).toHaveBeenCalled;
                    expect(mockuser.getPassword()).toHaveBeenCalled;
                    expect(mockuser.getEmail()).toHaveBeenCalled;
                    expect(mockuser.getFirstname()).toHaveBeenCalled;
                    expect(mockuser.getLastname()).toHaveBeenCalled;
                    expect(mockuser.getBio()).toHaveBeenCalled;
                    expect(mockuser.getSalt()).toHaveBeenCalled;
                    expect(mockuser.getProfilePicPath()).toHaveBeenCalled;
                    return [2 /*return*/];
            }
        });
    }); });
    test("Create throws an error when the username already exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, mockuser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new UserPGSQLRepo_1.default(mockConnectionObject);
                    utils_1.mocked(User_1.default).mockImplementation(function () {
                        return {
                            userid: 1,
                            username: "First User",
                            password: "1234",
                            email: "air.m@gmail.com",
                            firstname: "a",
                            lastname: "m",
                            bio: "b",
                            salt: "1223f",
                            profilepic: "path/to/pic",
                            setUserid: jest.fn(function (value) { }),
                            getUserid: jest.fn(function () { return 1; }),
                            setUsername: jest.fn(function (value) { }),
                            getUsername: jest.fn(function () { return "First User"; }),
                            setPassword: jest.fn(function (value) { }),
                            getPassword: jest.fn(function () { return "1234"; }),
                            setEmail: jest.fn(function (value) { }),
                            getEmail: jest.fn(function () { return "air.m@gmail.com"; }),
                            setFirstname: jest.fn(function (value) { }),
                            getFirstname: jest.fn(function () { return "a"; }),
                            setLastname: jest.fn(function (value) { }),
                            getLastname: jest.fn(function () { return "m"; }),
                            setBio: jest.fn(function (value) { }),
                            getBio: jest.fn(function () { return "b"; }),
                            setSalt: jest.fn(function (value) { }),
                            getSalt: jest.fn(function () { return "1223f"; }),
                            setProfilePicPath: jest.fn(function (value) { }),
                            getProfilePicPath: jest.fn(function () { return "path/to/pic"; }),
                            usernameMatches: jest.fn(function (value) { return false; })
                        };
                    });
                    mockuser = new User_1.default();
                    return [4 /*yield*/, expect(repo.create(mockuser)).rejects.toThrowError()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test("Create throws an error when the email already exists", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, mockuser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new UserPGSQLRepo_1.default(mockConnectionObject);
                    utils_1.mocked(User_1.default).mockImplementation(function () {
                        return {
                            userid: 1,
                            username: "None User",
                            password: "1234",
                            email: "aaron.m@gmail.com",
                            firstname: "a",
                            lastname: "m",
                            bio: "b",
                            salt: "1223f",
                            profilepic: "path/to/pic",
                            setUserid: jest.fn(function (value) { }),
                            getUserid: jest.fn(function () { return 1; }),
                            setUsername: jest.fn(function (value) { }),
                            getUsername: jest.fn(function () { return "None User"; }),
                            setPassword: jest.fn(function (value) { }),
                            getPassword: jest.fn(function () { return "1234"; }),
                            setEmail: jest.fn(function (value) { }),
                            getEmail: jest.fn(function () { return "aaron.m@gmail.com"; }),
                            setFirstname: jest.fn(function (value) { }),
                            getFirstname: jest.fn(function () { return "a"; }),
                            setLastname: jest.fn(function (value) { }),
                            getLastname: jest.fn(function () { return "m"; }),
                            setBio: jest.fn(function (value) { }),
                            getBio: jest.fn(function () { return "b"; }),
                            setSalt: jest.fn(function (value) { }),
                            getSalt: jest.fn(function () { return "1223f"; }),
                            setProfilePicPath: jest.fn(function (value) { }),
                            getProfilePicPath: jest.fn(function () { return "path/to/pic"; }),
                            usernameMatches: jest.fn(function (value) { return false; })
                        };
                    });
                    mockuser = new User_1.default();
                    return [4 /*yield*/, expect(repo.create(mockuser)).rejects.toThrowError()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test("Update works when given an existing user", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, mockuser, mockupdateduser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new UserPGSQLRepo_1.default(mockConnectionObject);
                    utils_1.mocked(User_1.default).mockImplementation(function () {
                        return {
                            userid: 1,
                            username: "First User",
                            password: "1234",
                            email: "air.m@gmail.com",
                            firstname: "a",
                            lastname: "m",
                            bio: "b",
                            salt: "1223f",
                            profilepic: "path/to/pic",
                            setUserid: jest.fn(function (value) { }),
                            getUserid: jest.fn(function () { return 1; }),
                            setUsername: jest.fn(function (value) { }),
                            getUsername: jest.fn(function () { return "First User"; }),
                            setPassword: jest.fn(function (value) { }),
                            getPassword: jest.fn(function () { return "1234"; }),
                            setEmail: jest.fn(function (value) { }),
                            getEmail: jest.fn(function () { return "air.m@gmail.com"; }),
                            setFirstname: jest.fn(function (value) { }),
                            getFirstname: jest.fn(function () { return "a"; }),
                            setLastname: jest.fn(function (value) { }),
                            getLastname: jest.fn(function () { return "m"; }),
                            setBio: jest.fn(function (value) { }),
                            getBio: jest.fn(function () { return "b"; }),
                            setSalt: jest.fn(function (value) { }),
                            getSalt: jest.fn(function () { return "1223f"; }),
                            setProfilePicPath: jest.fn(function (value) { }),
                            getProfilePicPath: jest.fn(function () { return "path/to/pic"; }),
                            usernameMatches: jest.fn(function (value) { return false; })
                        };
                    });
                    mockuser = new User_1.default();
                    return [4 /*yield*/, repo.update(mockuser)
                        //ensure the updated user has the expected updated property values 
                    ];
                case 1:
                    mockupdateduser = _a.sent();
                    //ensure the updated user has the expected updated property values 
                    expect(mockupdateduser.setUserid).toHaveBeenCalledWith(1);
                    expect(mockupdateduser.setUsername).toHaveBeenCalledWith("First User");
                    expect(mockupdateduser.setPassword).toHaveBeenCalledWith("1234");
                    expect(mockupdateduser.setEmail).toHaveBeenCalledWith("aaron.m@gmail.com");
                    expect(mockupdateduser.setFirstname).toHaveBeenCalledWith("a");
                    expect(mockupdateduser.setLastname).toHaveBeenCalledWith("m");
                    expect(mockupdateduser.setBio).toHaveBeenCalledWith("b");
                    expect(mockupdateduser.setProfilePicPath).toHaveBeenCalledWith("path/to/pic");
                    return [2 /*return*/];
            }
        });
    }); });
    test("Update throws an error when trying to update a user that does not exist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, mockuser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new UserPGSQLRepo_1.default(mockConnectionObject);
                    utils_1.mocked(User_1.default).mockImplementation(function () {
                        return {
                            userid: 1,
                            username: "Not User",
                            password: "1234",
                            email: "air.m@gmail.com",
                            firstname: "a",
                            lastname: "m",
                            bio: "b",
                            salt: "1223f",
                            profilepic: "path/to/pic",
                            setUserid: jest.fn(function (value) { }),
                            getUserid: jest.fn(function () { return 1; }),
                            setUsername: jest.fn(function (value) { }),
                            getUsername: jest.fn(function () { return "Not User"; }),
                            setPassword: jest.fn(function (value) { }),
                            getPassword: jest.fn(function () { return "1234"; }),
                            setEmail: jest.fn(function (value) { }),
                            getEmail: jest.fn(function () { return "air.m@gmail.com"; }),
                            setFirstname: jest.fn(function (value) { }),
                            getFirstname: jest.fn(function () { return "a"; }),
                            setLastname: jest.fn(function (value) { }),
                            getLastname: jest.fn(function () { return "m"; }),
                            setBio: jest.fn(function (value) { }),
                            getBio: jest.fn(function () { return "b"; }),
                            setSalt: jest.fn(function (value) { }),
                            getSalt: jest.fn(function () { return "1223f"; }),
                            setProfilePicPath: jest.fn(function (value) { }),
                            getProfilePicPath: jest.fn(function () { return "path/to/pic"; }),
                            usernameMatches: jest.fn(function (value) { return false; })
                        };
                    });
                    mockuser = new User_1.default();
                    return [4 /*yield*/, expect(repo.update(mockuser)).rejects.toThrowError("Error: Not found")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
