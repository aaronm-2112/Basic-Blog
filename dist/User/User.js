"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Can implement an interface for a User if it will become necessary in the future. 
var User = /** @class */ (function () {
    function User() {
        this.userid = 0;
        this.username = "";
        this.password = "";
        this.email = "";
        this.firstname = "";
        this.lastname = "";
        this.bio = "";
        this.salt = "";
        this.profilepic = "";
    }
    User.prototype.getUsername = function () {
        return this.username;
    };
    User.prototype.setUsername = function (username) {
        this.username = username;
    };
    User.prototype.getPassword = function () {
        return this.password;
    };
    User.prototype.setPassword = function (password) {
        this.password = password;
    };
    User.prototype.getEmail = function () {
        return this.email;
    };
    User.prototype.setEmail = function (email) {
        this.email = email;
    };
    User.prototype.getUserID = function () {
        return this.userid;
    };
    User.prototype.setUserID = function (id) {
        this.userid = id;
    };
    User.prototype.getFirstname = function () {
        return this.firstname;
    };
    User.prototype.setFirstname = function (firstname) {
        this.firstname = firstname;
    };
    User.prototype.getLastname = function () {
        return this.lastname;
    };
    User.prototype.setLastname = function (lastname) {
        this.lastname = lastname;
    };
    User.prototype.getBio = function () {
        return this.bio;
    };
    User.prototype.setBio = function (bio) {
        this.bio = bio;
    };
    User.prototype.getSalt = function () {
        return this.salt;
    };
    User.prototype.setSalt = function (salt) {
        this.salt = salt;
    };
    User.prototype.getProfilePicPath = function () {
        return this.profilepic;
    };
    User.prototype.setProfilePicPath = function (path) {
        this.profilepic = path;
    };
    User.prototype.usernameMatches = function (incomingUsername) {
        return this.username === incomingUsername;
    };
    return User;
}());
exports.default = User;
