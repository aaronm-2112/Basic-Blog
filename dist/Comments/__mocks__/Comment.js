"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import this named export into your test file:
var mock = jest.fn().mockImplementation(function () {
    var mockSetCommentid = jest.fn();
    var mockGetCommentid = jest.fn(function () { return 2; });
    var mockSetBlogid = jest.fn();
    var mockGetBlogid = jest.fn();
    var mockSetUsername = jest.fn();
    var mockGetUsername = jest.fn(function () { return "First user"; });
    var mockSetContent = jest.fn();
    var mockGetContent = jest.fn();
    var mockSetReply = jest.fn();
    var mockGetReply = jest.fn();
    var mockSetReplyto = jest.fn();
    var mockGetReplyto = jest.fn();
    var mockSetLikes = jest.fn();
    var mockGetLikes = jest.fn(function () { return 1; });
    var mockSetLikedby = jest.fn();
    var mockGetLikedby = jest.fn();
    var mockSetDeleted = jest.fn();
    var mockGetDeleted = jest.fn();
    var mockSetCreated = jest.fn();
    var mockGetCreated = jest.fn();
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
