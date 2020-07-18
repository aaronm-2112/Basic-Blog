"use strict";
//Purpose:  A concrete implementation of the blog interface 
Object.defineProperty(exports, "__esModule", { value: true });
//TODO: Add getters and setters
var Blog = /** @class */ (function () {
    function Blog() {
        this.blogID = -1; //give junk value so it breaks if unset id gets through 
        this.username = "";
        this.title = "";
        this.content = "";
        this.titleImagePath = "";
    }
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
