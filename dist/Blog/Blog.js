"use strict";
//Purpose:  A concrete implementation of the blog interface 
Object.defineProperty(exports, "__esModule", { value: true });
//TODO: Add getters and setters
var Blog = /** @class */ (function () {
    function Blog() {
        this.blogid = -1; //give junk value so it breaks if unset id gets through 
        this.username = "";
        this.title = "";
        this.content = "";
        this.titleimagepath = "";
    }
    //getters
    Blog.prototype.getBlogid = function () {
        return this.blogid;
    };
    Blog.prototype.getUsername = function () {
        return this.username;
    };
    Blog.prototype.getTitle = function () {
        return this.title;
    };
    Blog.prototype.getContent = function () {
        return this.content;
    };
    Blog.prototype.getTitleimagepath = function () {
        return this.titleimagepath;
    };
    //setters
    Blog.prototype.setBlogid = function (id) {
        this.blogid = id;
    };
    Blog.prototype.setUsername = function (username) {
        this.username = username;
    };
    Blog.prototype.setTitle = function (title) {
        this.title = title;
    };
    Blog.prototype.setContent = function (content) {
        this.content = content;
    };
    Blog.prototype.setTitleimagepath = function (titleimagepath) {
        this.titleimagepath = titleimagepath;
    };
    //validate if a user owns this blog resource
    Blog.prototype.creator = function (incomingUser) {
        if (this.username === incomingUser) {
            return true;
        }
        return false;
    };
    return Blog;
}());
exports.default = Blog;
