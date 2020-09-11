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
    //add a like to the comment's like count and the user who liked the comment to the comment's likedby collection
    Comment.prototype.addLike = function (username) {
        if (!this.alreadyLiked(username)) {
            this.likes += 1;
            this.likedby.push(username);
            return true;
        }
        return false;
    };
    //determine if a user already liked this comment -- if so they cannot like it again
    Comment.prototype.alreadyLiked = function (username) {
        var liked = this.likedby.some(function (user) {
            return user === username;
        });
        return liked;
    };
    //marks a comment as deleted, setting comment content to [deleted]
    Comment.prototype.markDeleted = function (username) {
        //ensure incoming user owns the comment
        if (this.username !== username) {
            //comment not marked as deleted b/c user does not own the comment
            return false;
        }
        //set deleted to true 
        this.deleted = true;
        //set content to [deleted]
        this.content = "[deleted]";
        //return true to indicate comment is marked as deleted
        return true;
    };
    //edit the comment's content
    Comment.prototype.editContent = function (username, content) {
        //ensure incoming user owns the comment
        if (this.username !== username) {
            //comment not marked as deleted b/c user does not own the comment
            return false;
        }
        //check if the comment is marked as deleted
        if (this.deleted) {
            //cannot edit content when comment is marked as deleted
            return false;
        }
        //edit the comment content
        this.content = content;
        //return true
        return true;
    };
    return Comment;
}());
exports.default = Comment;
