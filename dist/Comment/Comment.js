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
        this.deleted = false;
        this.created = new Date();
    }
    Comment.prototype.setCreatedDate = function (date) {
        this.created = date;
    };
    Comment.prototype.getCreatedDate = function () {
        return this.created;
    };
    return Comment;
}());
exports.default = Comment;
