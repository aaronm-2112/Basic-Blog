"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import this named export into your test file:
var mock = jest.fn().mockImplementation(function () {
    var mockSetBlogid = jest.fn(function (value) { });
    var mockGetBlogid = jest.fn(function () { return 1; });
    var mockSetUsername = jest.fn(function (value) { });
    var mockGetUsername = jest.fn(function () { return "First User"; });
    var mockSetTitle = jest.fn(function (value) { });
    var mockGetTitle = jest.fn(function () { return "Third blog"; });
    var mockSetContent = jest.fn(function (value) { });
    var mockGetContent = jest.fn(function () { return "My third blog"; });
    var mockSetTitleimagepath = jest.fn(function (value) { });
    var mockGetTitleimagepath = jest.fn(function () { return "/path/to/image"; });
    return {
        blogid: 1,
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
        mockGetTitleimagepath: mockGetTitleimagepath
    };
});
exports.default = mock;
