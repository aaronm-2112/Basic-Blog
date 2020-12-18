"use strict";
//Purpose: Basic tests to look for PGSQL comment repository queries for errors.
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
var CommentPGSQLRepo_1 = __importDefault(require("../../Comments/Repositories/CommentPGSQLRepo"));
var Comment_1 = __importDefault(require("../../Comments/Comment"));
var dbinit_1 = require("../../dbinit");
var PGConnection_1 = __importDefault(require("../../Common/PGConnection"));
var utils_1 = require("ts-jest/utils");
jest.mock('../../Comments/Comment');
jest.mock('../../Common/PGConnection');
/*
1. Create a functioning databse test -- will require a mock Comment object to be created [Done]
2. Add proper setup and teardown of the test [Done]
3. Account for Jest's test concurrency in within the database setup and teardown or the results will be wrong [Done]
4. Allow the repo being tested to connect using env variables + Create a test table/db in the beforeAll instead of working on the main/production database [Done]
5. Create basic tests of each of the 4 repository methods. [Done]
6. Create a more full test suite. [WIP]
Extras(steps that are optional but can be beneficial):
  5. Use a different approach for handling Jest's concurrency that does not force tests to run on a single worker

*/
describe("PGSQL Comment repository testing suite", function () {
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    //await resetDB(mockConnectionObject)
                    return [4 /*yield*/, dbinit_1.createDB(mockConnectionObject)];
                case 1:
                    //await resetDB(mockConnectionObject)
                    _a.sent();
                    return [4 /*yield*/, dbinit_1.populateDBWithTestData(mockConnectionObject)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    return [4 /*yield*/, dbinit_1.resetDB(mockConnectionObject)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test("A comment gets created and returns a valid commentid", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, mockComment, commentid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new CommentPGSQLRepo_1.default(mockConnectionObject);
                    mockComment = new Comment_1.default();
                    return [4 /*yield*/, repo.create(mockComment)];
                case 1:
                    commentid = _a.sent();
                    expect(commentid).toBeGreaterThanOrEqual(1);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Find returns the expected comment with the expected property values", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, comment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new CommentPGSQLRepo_1.default(mockConnectionObject);
                    return [4 /*yield*/, repo.find(1)
                        //ensure the setters for the resulting mock comment have been called with the correct row values in the repo returned from the find PGSQL query
                    ];
                case 1:
                    comment = _a.sent();
                    //ensure the setters for the resulting mock comment have been called with the correct row values in the repo returned from the find PGSQL query
                    expect(comment.setCommentid).toHaveBeenCalledWith(1);
                    expect(comment.setUsername).toHaveBeenCalledWith("First User");
                    expect(comment.setBlogid).toHaveBeenCalledWith(1);
                    expect(comment.setContent).toHaveBeenCalledWith("Good blog!");
                    expect(comment.setReply).toHaveBeenCalledWith(false);
                    expect(comment.setReplyto).toHaveBeenCalledWith(0);
                    expect(comment.setLikes).toHaveBeenCalledWith(0);
                    expect(comment.setCreated).toHaveBeenCalledWith(new Date(2000, 11, 31));
                    expect(comment.setDeleted).toHaveBeenCalledWith(false);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Find throws error when searching for a comment that does not exist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new CommentPGSQLRepo_1.default(mockConnectionObject);
                    return [4 /*yield*/, expect(repo.find(5)).rejects.toThrowError("Error: Not found")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    test("Findall returns all of the top level comments in blog 1 with the correct values", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, comments;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new CommentPGSQLRepo_1.default(mockConnectionObject);
                    return [4 /*yield*/, repo.findAll(1, false, 0, "likes", 1000, 1000, "next")];
                case 1:
                    comments = _a.sent();
                    expect(comments.length).toBe(2);
                    //ensure first comment has the correct values
                    expect(comments[0].setCommentid).toHaveBeenCalledWith(2);
                    expect(comments[0].setUsername).toHaveBeenCalledWith("First User");
                    expect(comments[0].setBlogid).toHaveBeenCalledWith(1);
                    expect(comments[0].setContent).toHaveBeenCalledWith("Okay blog!");
                    expect(comments[0].setReply).toHaveBeenCalledWith(false);
                    expect(comments[0].setReplyto).toHaveBeenCalledWith(0);
                    expect(comments[0].setLikes).toHaveBeenCalledWith(0);
                    expect(comments[0].setLikedby).toHaveBeenCalledWith([]);
                    expect(comments[0].setCreated).toHaveBeenCalledWith(new Date(2000, 11, 31));
                    expect(comments[0].setDeleted).toHaveBeenCalledWith(false);
                    //ensure the 2nd comment has the correct values
                    expect(comments[1].setCommentid).toHaveBeenCalledWith(1);
                    expect(comments[1].setUsername).toHaveBeenCalledWith("First User");
                    expect(comments[1].setBlogid).toHaveBeenCalledWith(1);
                    expect(comments[1].setContent).toHaveBeenCalledWith("Good blog!");
                    expect(comments[1].setReply).toHaveBeenCalledWith(false);
                    expect(comments[1].setReplyto).toHaveBeenCalledWith(0);
                    expect(comments[1].setLikes).toHaveBeenCalledWith(0);
                    expect(comments[1].setLikedby).toHaveBeenCalledWith([]);
                    expect(comments[1].setCreated).toHaveBeenCalledWith(new Date(2000, 11, 31));
                    expect(comments[1].setDeleted).toHaveBeenCalledWith(false);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Findall returns no comments when searching for comments in a blog that does not exist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, comments;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new CommentPGSQLRepo_1.default(mockConnectionObject);
                    return [4 /*yield*/, repo.findAll(20, false, 0, "likes", 1000, 1000, "next")];
                case 1:
                    comments = _a.sent();
                    expect(comments.length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Update successfully updates a row and returns a comment with the changes applied", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, mockComment, mockUpdatedComment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new CommentPGSQLRepo_1.default(mockConnectionObject);
                    mockComment = new Comment_1.default();
                    return [4 /*yield*/, repo.update(mockComment)
                        //test that the mockComment passed in had all of its getters called -- these are used to update the comments table in the database
                    ];
                case 1:
                    mockUpdatedComment = _a.sent();
                    //test that the mockComment passed in had all of its getters called -- these are used to update the comments table in the database
                    expect(mockComment.getCommentid).toHaveBeenCalled;
                    expect(mockComment.getBlogid).toHaveBeenCalled;
                    expect(mockComment.getUsername).toHaveBeenCalled;
                    expect(mockComment.getContent).toHaveBeenCalled;
                    expect(mockComment.getLikes).toHaveBeenCalled;
                    expect(mockComment.getLikedby).toHaveBeenCalled;
                    expect(mockComment.getReply).toHaveBeenCalled;
                    expect(mockComment.getReplyto).toHaveBeenCalled;
                    expect(mockComment.getCreated).toHaveBeenCalled;
                    expect(mockComment.getDeleted).toHaveBeenCalled;
                    //test that the updated comment returned has all of the values
                    expect(mockUpdatedComment.setCommentid).toHaveBeenCalledWith(1);
                    expect(mockUpdatedComment.setBlogid).toHaveBeenCalledWith(1);
                    expect(mockUpdatedComment.setUsername).toHaveBeenCalledWith("First User");
                    expect(mockUpdatedComment.setContent).toHaveBeenCalledWith("Mock content");
                    expect(mockUpdatedComment.setLikes).toHaveBeenCalledWith(0);
                    expect(mockUpdatedComment.setLikedby).toHaveBeenCalledWith([]);
                    expect(mockUpdatedComment.setReply).toHaveBeenCalledWith(true);
                    expect(mockUpdatedComment.setReplyto).toHaveBeenCalledWith(1);
                    expect(mockUpdatedComment.setCreated).toHaveBeenCalledWith(new Date(2001, 0, 31));
                    expect(mockUpdatedComment.setDeleted).toHaveBeenCalledWith(false);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Update throws an error when updating a comment that does not exist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, mockComment;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new CommentPGSQLRepo_1.default(mockConnectionObject);
                    utils_1.mocked(Comment_1.default).mockImplementation(function () {
                        var mockSetCommentid = jest.fn(function (value) { });
                        var mockGetCommentid = jest.fn(function () { return 30; });
                        var mockSetBlogid = jest.fn(function (value) { });
                        var mockGetBlogid = jest.fn(function () { return 1; });
                        var mockSetUsername = jest.fn(function (value) { });
                        var mockGetUsername = jest.fn(function () { return "First User"; });
                        var mockSetContent = jest.fn(function (value) { });
                        var mockGetContent = jest.fn(function () { return "Mock content"; });
                        var mockSetReply = jest.fn(function (value) { });
                        var mockGetReply = jest.fn(function () { return true; });
                        var mockSetReplyto = jest.fn(function (value) { });
                        var mockGetReplyto = jest.fn(function () { return 1; });
                        var mockSetLikes = jest.fn(function (value) { });
                        var mockGetLikes = jest.fn(function () { return 0; });
                        var mockSetLikedby = jest.fn(function (value) { });
                        var mockGetLikedby = jest.fn(function () { return []; });
                        var mockSetDeleted = jest.fn(function (value) { });
                        var mockGetDeleted = jest.fn(function () { return false; });
                        var mockSetCreated = jest.fn(function (value) { });
                        var mockGetCreated = jest.fn(function () { return new Date(2000, 12, 31); });
                        var mockAddLike = jest.fn(function (username) { });
                        var mockAlreadyLiked = jest.fn(function (username) { return false; });
                        var mockMarkDeleted = jest.fn(function (username) { });
                        var mockEditContent = jest.fn(function (username, content) { });
                        var mockIsOwner = jest.fn(function (username) { return false; });
                        return {
                            commentid: 1,
                            blogid: 1,
                            username: "First User",
                            content: "First comment",
                            reply: false,
                            replyto: 0,
                            likes: 1,
                            likedby: ["First User"],
                            deleted: false,
                            created: new Date(2000, 12, 31),
                            setCommentid: mockSetCommentid,
                            getCommentid: mockGetCommentid,
                            setBlogid: mockSetBlogid,
                            getBlogid: mockGetBlogid,
                            setUsername: mockSetUsername,
                            getUsername: mockGetUsername,
                            setContent: mockSetContent,
                            getContent: mockGetContent,
                            setReply: mockSetReply,
                            getReply: mockGetReply,
                            setReplyto: mockSetReplyto,
                            getReplyto: mockGetReplyto,
                            setLikes: mockSetLikes,
                            getLikes: mockGetLikes,
                            setLikedby: mockSetLikedby,
                            getLikedby: mockGetLikedby,
                            setDeleted: mockSetDeleted,
                            getDeleted: mockGetDeleted,
                            setCreated: mockSetCreated,
                            getCreated: mockGetCreated,
                            addLike: mockAddLike,
                            alreadyLiked: mockAlreadyLiked,
                            markDeleted: mockMarkDeleted,
                            editContent: mockEditContent,
                            isOwner: mockIsOwner
                        };
                    });
                    mockComment = new Comment_1.default();
                    return [4 /*yield*/, expect(repo.update(mockComment)).rejects.toThrowError("Error: Not found")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
