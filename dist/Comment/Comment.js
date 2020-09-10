"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Comment = /** @class */ (function () {
    //TODO(but likely won't): Query a time server for a consistent creation date across all user systems.  
    function Comment() {
        this.commentid = 0; //gets set by database values
        this.username = "";
        this.blogid = 0;
        this.content = "";
        this.reply = false;
        this.replyto = 0;
        this.likes = 0;
        this.likedby = [];
        this.deleted = false;
        this.created = new Date();
    }
    Comment.prototype.setCreatedDate = function (date) {
        this.created = date;
    };
    Comment.prototype.getCreatedDate = function () {
        return this.created;
    };
    //check comment properties against incoming values and update if any changes
    Comment.prototype.updateComment = function (content, username, deleted, like) {
        if (content === void 0) { content = ""; }
        if (username === void 0) { username = ""; }
        if (deleted === void 0) { deleted = false; }
        if (like === void 0) { like = false; }
        if (this.content !== content)
            this.content = content;
        if (this.username !== username)
            this.username = username;
        if (this.deleted !== deleted)
            this.deleted = deleted;
        if (like)
            this.likes += 1;
    };
    //determine if a user already liked this comment
    Comment.prototype.alreadyLiked = function (username) {
        var liked = this.likedby.some(function (user) {
            return user === username;
        });
        return liked;
    };
    return Comment;
}());
exports.default = Comment;
