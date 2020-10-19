"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Comment_1 = __importDefault(require("../../Comments/Comment"));
//Setter and getter testing---------------------------------------------------------
test("Setters and getters for commentid are correct", function () {
    var comment = new Comment_1.default();
    comment.setCommentid(1);
    expect(comment.getCommentid()).toBe(1);
});
test("Setters and getters for blogid are correct", function () {
    var comment = new Comment_1.default();
    comment.setBlogid(2);
    expect(comment.getBlogid()).toBe(2);
});
test("Setters and getters for content are correct", function () {
    var comment = new Comment_1.default();
    comment.setContent("comment");
    expect(comment.getContent()).toBe("comment");
});
test("Setters and getters for created are correct", function () {
    var comment = new Comment_1.default();
    var date = new Date();
    comment.setCreated(date);
    expect(comment.getCreated()).toBe(date);
});
test("Setters and getters for deleted are correct", function () {
    var comment = new Comment_1.default();
    comment.setDeleted(true);
    expect(comment.getDeleted()).toBe(true);
});
test("Setters and getters for likedby are correct", function () {
    var comment = new Comment_1.default();
    comment.setLikedby(["First User"]);
    expect(comment.getLikedby()).toStrictEqual(["First User"]);
});
test("Setters and getters for likes are correct", function () {
    var comment = new Comment_1.default();
    comment.setLikes(4);
    expect(comment.getLikes()).toBe(4);
});
test("Setters and getters for reply are correct", function () {
    var comment = new Comment_1.default();
    comment.setReply(true);
    expect(comment.getReply()).toBe(true);
});
test("Setters and getters for replyto are correct", function () {
    var comment = new Comment_1.default();
    comment.setReplyto(5);
    expect(comment.getReplyto()).toBe(5);
});
test("Setters and getters for username are correct", function () {
    var comment = new Comment_1.default();
    comment.setUsername("First User");
    expect(comment.getUsername()).toBe("First User");
});
//alreadyLiked method testing-------------------------------------------------------------------
test("AlreadyLiked returns false when a client has not yet liked a comment", function () {
    var comment = new Comment_1.default();
    expect(comment.alreadyLiked("First User")).toBe(false);
});
test("AlreadyLiked returns true when a client has already liked a comment", function () {
    var comment = new Comment_1.default();
    comment.addLike("First User");
    expect(comment.alreadyLiked("First User")).toBe(true);
});
//addlike method tests--------------------------------------------------------------------------
test("User adds a like to a comment - total likes will be 1", function () {
    var comment = new Comment_1.default();
    comment.addLike("First User");
    expect(comment.likes).toBe(1);
});
test("User adds a like to a comment - likedby collection will have that user", function () {
    var comment = new Comment_1.default();
    comment.addLike("First User");
    expect(comment.getLikedby().pop()).toBe("First User");
});
test("Throw error when a user attempts to like the same comment more than once", function () {
    var comment = new Comment_1.default();
    comment.addLike("First User");
    expect(function () { comment.addLike("First User"); }).toThrow(Error);
});
test("Two users like a comment - total likes will be 2", function () {
    var comment = new Comment_1.default();
    comment.addLike("First User");
    comment.addLike("Second User");
    expect(comment.getLikes()).toBe(2);
});
//isOwner method tests--------------------------------------------------------------------------
test("A user is identified as the owner of a comment", function () {
    var comment = new Comment_1.default();
    comment.setUsername("First User");
    expect(comment.isOwner("First User")).toBe(true);
});
test("A user isn't the owner of a comment", function () {
    var comment = new Comment_1.default();
    comment.setUsername("First User");
    expect(comment.isOwner("First Client")).toBe(false);
});
//Tests for markDeleted method--------------------------------------------------------------------------
test("Client cannot mark a comment they do not own as deleted", function () {
    var comment = new Comment_1.default();
    comment.setUsername("First User");
    expect(function () { comment.markDeleted("First Snoozer"); }).toThrow(Error);
});
test("Deleted property is true after comment owner marks their comment as deleted", function () {
    var comment = new Comment_1.default();
    comment.setUsername("First User");
    comment.markDeleted("First User");
    expect(comment.getDeleted()).toBe(true);
});
test("Content property is [deleted] after comment owner marks their comment as deleted", function () {
    var comment = new Comment_1.default();
    comment.setUsername("First User");
    comment.markDeleted("First User");
    expect(comment.getContent()).toBe("[deleted]");
});
//Tests for editContent method--------------------------------------------------------------------------
test("Comment owner edits the comment content to Silly willie", function () {
    var comment = new Comment_1.default();
    comment.setUsername("First User");
    comment.editContent("First User", "Silly willie");
    expect(comment.getContent()).toBe("Silly willie");
});
test("Client gets error when editing the content of their comment that is marked as deleted", function () {
    var comment = new Comment_1.default();
    comment.setUsername("First User");
    comment.markDeleted("First User");
    expect(function () { comment.editContent("First User", "Silly willie"); }).toThrow(Error);
});
test("Client gets error when attempting to edit the content of a comment they do not own", function () {
    var comment = new Comment_1.default();
    comment.setUsername("First User");
    expect(function () { comment.editContent("First Client", "Silly willie"); }).toThrow(Error);
});