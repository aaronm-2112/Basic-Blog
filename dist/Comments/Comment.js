"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
Note: kept interfaces but moved properties to base classes due to jest making private properties
     inaccesible and me not finding a suitable workaround that would be worth it
     -- not worth it in that i don't need the extra extensibility in this project.
*/
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
    //getters
    Comment.prototype.getCommentid = function () {
        return this.commentid;
    };
    Comment.prototype.getUsername = function () {
        return this.username;
    };
    Comment.prototype.getBlogid = function () {
        return this.blogid;
    };
    Comment.prototype.getContent = function () {
        return this.content;
    };
    Comment.prototype.getReply = function () {
        return this.reply;
    };
    Comment.prototype.getReplyto = function () {
        return this.replyto;
    };
    Comment.prototype.getLikes = function () {
        return this.likes;
    };
    Comment.prototype.getLikedby = function () {
        return this.likedby;
    };
    Comment.prototype.getDeleted = function () {
        return this.deleted;
    };
    Comment.prototype.getCreated = function () {
        return this.created;
    };
    //setters
    Comment.prototype.setCommentid = function (commentid) {
        this.commentid = commentid;
    };
    Comment.prototype.setUsername = function (username) {
        this.username = username;
    };
    Comment.prototype.setBlogid = function (blogid) {
        this.blogid = blogid;
    };
    Comment.prototype.setContent = function (content) {
        this.content = content;
    };
    Comment.prototype.setReply = function (reply) {
        this.reply = reply;
    };
    Comment.prototype.setReplyto = function (replyto) {
        this.replyto = replyto;
    };
    Comment.prototype.setLikes = function (likes) {
        this.likes = likes;
    };
    Comment.prototype.setLikedby = function (likedby) {
        this.likedby = likedby;
    };
    Comment.prototype.setDeleted = function (deleted) {
        this.deleted = deleted;
    };
    Comment.prototype.setCreated = function (created) {
        this.created = created;
    };
    //add a like to the comment's like count and the user who liked the comment to the comment's likedby collection
    Comment.prototype.addLike = function (username) {
        if (!this.alreadyLiked(username)) {
            this.likes += 1;
            this.likedby.push(username);
        }
        else {
            throw new Error("Client already liked this comment");
        }
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
        if (!this.isOwner(username)) {
            throw new Error("Client does not own the comment");
        }
        //set deleted to true 
        this.deleted = true;
        //set content to [deleted]
        this.content = "[deleted]";
    };
    //edit the comment's content
    Comment.prototype.editContent = function (username, content) {
        //ensure incoming user owns the comment
        if (!this.isOwner(username)) {
            //comment not marked as deleted b/c user does not own the comment
            throw new Error("Client does not own the comment");
        }
        //check if the comment is marked as deleted
        if (this.deleted) {
            //cannot edit content when comment is marked as deleted
            throw new Error("Comment is already deleted");
        }
        //edit the comment content
        this.content = content;
    };
    Comment.prototype.isOwner = function (username) {
        return this.username === username;
    };
    return Comment;
}());
exports.default = Comment;
