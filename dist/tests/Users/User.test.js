"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = __importDefault(require("../../User/User"));
//Setter and getter testing---------------------------------------------------------
test("Setters and getters for userid are correct", function () {
    var user = new User_1.default();
    user.setUserID(1);
    expect(user.getUserID()).toBe(1);
});
test("Setters and getters for username are correct", function () {
    var user = new User_1.default();
    user.setUsername("First User");
    expect(user.getUsername()).toBe("First User");
});
test("Setters and getters for password are correct", function () {
    var user = new User_1.default();
    user.setPassword("1234");
    expect(user.getPassword()).toBe("1234");
});
test("Setters and getters for email are correct", function () {
    var user = new User_1.default();
    user.setEmail("aaron.marr@gmail.com");
    expect(user.getEmail()).toBe("aaron.marr@gmail.com");
});
test("Setters and getters for firstname are correct", function () {
    var user = new User_1.default();
    user.setFirstname("aaron");
    expect(user.getFirstname()).toBe("aaron");
});
test("Setters and getters for lastname are correct", function () {
    var user = new User_1.default();
    user.setLastname("aaron");
    expect(user.getLastname()).toBe("aaron");
});
test("Setters and getters for bio are correct", function () {
    var user = new User_1.default();
    user.setBio("my bio");
    expect(user.getBio()).toBe("my bio");
});
test("Setters and getters for salt are correct", function () {
    var user = new User_1.default();
    user.setSalt("123214f");
    expect(user.getSalt()).toBe("123214f");
});
test("Setters and getters for profilepic are correct", function () {
    var user = new User_1.default();
    user.setProfilePicPath("path/to/file");
    expect(user.getProfilePicPath()).toBe("path/to/file");
});
//testing the usernameMatches method
test("Client username matches with comment's username -- return true", function () {
    var user = new User_1.default();
    user.setUsername("First User");
    expect(user.usernameMatches("First User")).toBe(true);
});
test("Client username does not match with comment's username -- return false", function () {
    var user = new User_1.default();
    user.setUsername("First User");
    expect(user.usernameMatches("First Client")).toBe(false);
});
