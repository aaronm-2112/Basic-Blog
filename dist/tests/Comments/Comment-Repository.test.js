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
/*
Purpose: Test the PGSQL comment repository
Con: The repository test includes a dependency on the comment model.
Rationale:
     - The reason for not using a mock was that, to my knowledge, I cannot test the repo without redesigning it if I wanted to use a mock.
     - Given the size of the application I decided this is something that can be managed and that the redesign was not worth it.
*/
var CommentPGSQLRepo_1 = __importDefault(require("../../Comments/Repositories/CommentPGSQLRepo"));
var Comment_1 = __importDefault(require("../../Comments/Comment"));
var dbinit_1 = require("../../dbinit");
var PGConnection_1 = __importDefault(require("../../Common/PGConnection"));
jest.mock('../../Comments/Comment');
jest.mock('../../Common/PGConnection');
//TODO: Add a test for each repo call that ensures the query method of the connection pool is called with the correct parameters as well
//      This is a more usual unit test that should also be done alongside testing the sql queries themselves for correctness.
/*
1. Create a functioning databse test -- will require a mock Comment object to be created [Done]
2. Add proper setup and teardown of the test [Done]
3. Account for Jest's test concurrency in within the database setup and teardown or the results will be wrong [Done]
4. Allow the repo being tested to connect using env variables + Create a test table/db in the beforeAll instead of working on the main/production database [Done]
Extras(steps that are optional but can be beneficial):
  5. Use a different approach for handling Jest's concurrency that does not force tests to run on a single worker

*/
//TODO: Do not use mock here?
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    var mockConnectionObject;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mockConnectionObject = new PGConnection_1.default();
                return [4 /*yield*/, dbinit_1.createDB(mockConnectionObject)];
            case 1:
                _a.sent();
                return [4 /*yield*/, dbinit_1.populateDBWithTestData(mockConnectionObject)];
            case 2:
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
test("Finding a comment returns all of the correct comment values", function () { return __awaiter(void 0, void 0, void 0, function () {
    var mockConnectionObject, repo, comment, mockComment;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mockConnectionObject = new PGConnection_1.default();
                repo = new CommentPGSQLRepo_1.default(mockConnectionObject);
                return [4 /*yield*/, repo.find(2)
                    //expected output is the same as the mockComment's default values
                ];
            case 1:
                comment = _a.sent();
                mockComment = new Comment_1.default();
                expect(comment.getLikes()).toEqual(mockComment.getLikes());
                expect(comment.likes).toEqual(mockComment.likes);
                return [2 /*return*/];
        }
    });
}); });
// jest.mock('../../Comments/Comment', () => {
//   return jest.fn().mockImplementation(() => {
//     return {
//       commentid: 2,
//       blogid: 1,
//       username: "First User",
//       content: "Good blog!",
//       reply: false,
//       replyto: 0,
//       likes: 0,
//       likedby: [],
//       deleted: false,
//       created: new Date()
//     };
//   });
// });
// beforeAll(() => {
//   Comment.mockImplementation(() => {
//     // Replace the class-creation method with this mock version.
//     return {
//       mockedMethod: () => { } // Populate the method with a reference to a mock created with jest.fn().
//     };
//   });
// });
// jest.mock("../../Comment/Comment", () => {
//   return jest.fn().mockImplementation(() => {
//     const mockSetLike = jest.fn()
//     const mockGetLikes = jest.fn()
//     return {
//       commentid: 1,
//       username: "First User",
//       content: "First comment",
//       reply: false,
//       replyto: 0,
//       likes: 1,
//       likedby: ["First User"],
//       deleted: false,
//       created: new Date(),
//       setLikes: mockSetLike,
//       getLikes: mockGetLikes
//     }
//   })
// })
