"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import this named export into your test file:
var mock = jest.fn().mockImplementation(function () {
    var mockSetCommentid = jest.fn(function (value) { });
    var mockGetCommentid = jest.fn(function () { return 1; });
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
        getCreated: mockGetCreated
    };
});
exports.default = mock;
