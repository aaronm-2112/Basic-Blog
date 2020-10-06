"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Blog_1 = __importDefault(require("../../Blog/Blog"));
//Getters and setter tests------------------------------------
test("Setters and getters for blogid are correct", function () {
    var blog = new Blog_1.default();
    blog.setBlogid(1);
    expect(blog.getBlogid()).toBe(1);
});
test("Setters and getters for username are correct", function () {
    var blog = new Blog_1.default();
    blog.setUsername("Aa");
    expect(blog.getUsername()).toBe("Aa");
});
test("Setters and getters for title are correct", function () {
    var blog = new Blog_1.default();
    blog.setTitle("Title 1");
    expect(blog.getTitle()).toBe("Title 1");
});
test("Setters and getters for content are correct", function () {
    var blog = new Blog_1.default();
    blog.setContent("Newest content");
    expect(blog.getContent()).toBe("Newest content");
});
test("Setters and getters for titleimagepath are correct", function () {
    var blog = new Blog_1.default();
    blog.setTitleimagepath("/path/file");
    expect(blog.getTitleimagepath()).toBe("/path/file");
});
//Creator method testing-----------------------------------------
test("Should return true that the client that created a blog is the owner of the blog", function () {
    var blog = new Blog_1.default();
    blog.setUsername("First User");
    expect(blog.creator("First User")).toBe(true);
});
test("Should return false that a client is the creator of the blog when they are not the creator", function () {
    var blog = new Blog_1.default();
    blog.setUsername("First User");
    expect(blog.creator("First Client")).toBe(false);
});
