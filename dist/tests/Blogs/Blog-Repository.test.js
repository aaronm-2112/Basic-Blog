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
var BlogPGSQLRepo_1 = __importDefault(require("../../Blog/Repositories/BlogPGSQLRepo"));
var Blog_1 = __importDefault(require("../../Blog/Blog"));
var dbinit_1 = require("../../dbinit");
var PGConnection_1 = __importDefault(require("../../Common/PGConnection"));
var BlogSearchCriteria_1 = require("../../Blog/BlogSearchCriteria");
var utils_1 = require("ts-jest/utils");
jest.mock('../../Blog/Blog');
jest.mock('../../Common/PGConnection');
describe("PGSQL Blog repository testing suite", function () {
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
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
    test("Findall returns all of the expected blogs with expected property values when searching by username", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, blogs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new BlogPGSQLRepo_1.default(mockConnectionObject);
                    return [4 /*yield*/, repo.findAll(BlogSearchCriteria_1.searchParameters.Username, "First User", "1000", "<")];
                case 1:
                    blogs = _a.sent();
                    expect(blogs[0].setBlogid).toHaveBeenCalledWith(2);
                    expect(blogs[0].setUsername).toHaveBeenCalledWith("First User");
                    expect(blogs[0].setTitle).toHaveBeenCalledWith("Blog Two");
                    expect(blogs[0].setContent).toHaveBeenCalledWith("Second blog");
                    expect(blogs[0].setTitleimagepath).toHaveBeenCalledWith("/uploads/1233");
                    return [2 /*return*/];
            }
        });
    }); });
    test("Findall returns no items when searching for blogs with a username that does not exist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, blogs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new BlogPGSQLRepo_1.default(mockConnectionObject);
                    return [4 /*yield*/, repo.findAll(BlogSearchCriteria_1.searchParameters.Username, "Not User", "1000", "<")];
                case 1:
                    blogs = _a.sent();
                    expect(blogs.length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Findall returns all expected blogs with expected property values when searching by title", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, blogs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new BlogPGSQLRepo_1.default(mockConnectionObject);
                    return [4 /*yield*/, repo.findAll(BlogSearchCriteria_1.searchParameters.Title, "Blog One", "1000", "<")
                        //first blog result
                    ];
                case 1:
                    blogs = _a.sent();
                    //first blog result
                    expect(blogs[0].setBlogid).toHaveBeenCalledWith(3);
                    expect(blogs[0].setUsername).toHaveBeenCalledWith("Second User");
                    expect(blogs[0].setTitle).toHaveBeenCalledWith("Blog One");
                    expect(blogs[0].setContent).toHaveBeenCalledWith("First blog");
                    expect(blogs[0].setTitleimagepath).toHaveBeenCalledWith("/uploads/1233");
                    //second blog result
                    expect(blogs[1].setBlogid).toHaveBeenCalledWith(1);
                    expect(blogs[1].setUsername).toHaveBeenCalledWith("First User");
                    expect(blogs[1].setTitle).toHaveBeenCalledWith("Blog One");
                    expect(blogs[1].setContent).toHaveBeenCalledWith("First blog");
                    expect(blogs[1].setTitleimagepath).toHaveBeenCalledWith("/uploads/1233");
                    return [2 /*return*/];
            }
        });
    }); });
    test("Findall returns no blogs when searching by title for a title that does not exist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, blogs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new BlogPGSQLRepo_1.default(mockConnectionObject);
                    return [4 /*yield*/, repo.findAll(BlogSearchCriteria_1.searchParameters.Title, "Not Title", "1000", "<")];
                case 1:
                    blogs = _a.sent();
                    expect(blogs.length).toBe(0);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Find returns Second User's blog from the database with the expected property values", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, mockBlog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new BlogPGSQLRepo_1.default(mockConnectionObject);
                    return [4 /*yield*/, repo.find(BlogSearchCriteria_1.searchParameters.Username, "Second User")];
                case 1:
                    mockBlog = _a.sent();
                    expect(mockBlog).not.toBe(null);
                    expect(mockBlog.setBlogid(3));
                    expect(mockBlog.setUsername("Second User"));
                    expect(mockBlog.setContent("First blog"));
                    expect(mockBlog.setTitle("Blog One"));
                    expect(mockBlog.setTitleimagepath("/uploads/1233"));
                    return [2 /*return*/];
            }
        });
    }); });
    test("Find returns null when searching for a blog that does not exist(searching by username)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, nullResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new BlogPGSQLRepo_1.default(mockConnectionObject);
                    return [4 /*yield*/, repo.find(BlogSearchCriteria_1.searchParameters.Username, "Not User")];
                case 1:
                    nullResponse = _a.sent();
                    expect(nullResponse).toBe(null);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Find returns the expected blog when searching by title", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, mockBlog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new BlogPGSQLRepo_1.default(mockConnectionObject);
                    return [4 /*yield*/, repo.find(BlogSearchCriteria_1.searchParameters.Title, "Blog Two")];
                case 1:
                    mockBlog = _a.sent();
                    expect(mockBlog).not.toBe(null);
                    expect(mockBlog.setBlogid(2));
                    expect(mockBlog.setUsername("First User"));
                    expect(mockBlog.setContent("Blog Two"));
                    expect(mockBlog.setTitle("Second blog"));
                    expect(mockBlog.setTitleimagepath("/uploads/1233"));
                    return [2 /*return*/];
            }
        });
    }); });
    test("Find returns null when searching for a blog that doesn't exist(searching by title)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, nullResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new BlogPGSQLRepo_1.default(mockConnectionObject);
                    return [4 /*yield*/, repo.find(BlogSearchCriteria_1.searchParameters.Title, "Not User")];
                case 1:
                    nullResponse = _a.sent();
                    expect(nullResponse).toBe(null);
                    return [2 /*return*/];
            }
        });
    }); });
    //I'm less happy with this test b/c the repo may not place one of the getProperty method values into the paramaterized statement, but,
    //call all 3 of them just the same. A fix would be if the create method itself returned the resulting comment to back to the client. 
    test("Create inserts a blog in the database and returns its blogid", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, mockBlog, blogid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new BlogPGSQLRepo_1.default(mockConnectionObject);
                    mockBlog = new Blog_1.default();
                    return [4 /*yield*/, repo.create(mockBlog)];
                case 1:
                    blogid = _a.sent();
                    expect(blogid).toBeGreaterThan(1);
                    expect(mockBlog.getUsername).toHaveBeenCalled;
                    expect(mockBlog.getTitle).toHaveBeenCalled;
                    expect(mockBlog.getContent).toHaveBeenCalled;
                    return [2 /*return*/];
            }
        });
    }); });
    test("Update returns a blog composed of the updated database row", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, mockBlog, mockUpdatedBlog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new BlogPGSQLRepo_1.default(mockConnectionObject);
                    mockBlog = new Blog_1.default();
                    return [4 /*yield*/, repo.update(mockBlog)];
                case 1:
                    mockUpdatedBlog = _a.sent();
                    expect(mockUpdatedBlog.setBlogid).toHaveBeenCalledWith(1);
                    expect(mockUpdatedBlog.setUsername).toHaveBeenCalledWith("First User");
                    expect(mockUpdatedBlog.setTitle).toHaveBeenCalledWith("First Blog");
                    expect(mockUpdatedBlog.setContent).toHaveBeenCalledWith("My content");
                    expect(mockUpdatedBlog.setTitleimagepath).toHaveBeenCalledWith("/path/to/image");
                    return [2 /*return*/];
            }
        });
    }); });
    test("Update throws an error when the blog does not exist", function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockConnectionObject, repo, mockBlog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockConnectionObject = new PGConnection_1.default();
                    repo = new BlogPGSQLRepo_1.default(mockConnectionObject);
                    utils_1.mocked(Blog_1.default, true).mockImplementation(function () {
                        var mockSetBlogid = jest.fn(function (value) { });
                        var mockGetBlogid = jest.fn(function () { return 4; });
                        var mockSetUsername = jest.fn(function (value) { });
                        var mockGetUsername = jest.fn(function () { return "First User"; });
                        var mockSetTitle = jest.fn(function (value) { });
                        var mockGetTitle = jest.fn(function () { return "Third blog"; });
                        var mockSetContent = jest.fn(function (value) { });
                        var mockGetContent = jest.fn(function () { return "My third blog"; });
                        var mockSetTitleimagepath = jest.fn(function (value) { });
                        var mockGetTitleimagepath = jest.fn(function () { return "/path/to/image"; });
                        var mockCreator = jest.fn(function (username) { return false; });
                        return {
                            blogid: 4,
                            username: "First User",
                            title: "First Blog",
                            content: "My content",
                            titleimagepath: "/path/to/image",
                            setBlogid: mockSetBlogid,
                            getBlogid: mockGetBlogid,
                            setUsername: mockSetUsername,
                            getUsername: mockGetUsername,
                            setTitle: mockSetTitle,
                            getTitle: mockGetTitle,
                            setContent: mockSetContent,
                            getContent: mockGetContent,
                            setTitleimagepath: mockSetTitleimagepath,
                            getTitleimagepath: mockGetTitleimagepath,
                            creator: mockCreator
                        };
                    });
                    mockBlog = new Blog_1.default();
                    return [4 /*yield*/, expect(repo.update(mockBlog)).rejects.toThrowError("Error: Not found")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
