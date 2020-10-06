"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import this named export into your test file:
var mock = jest.fn().mockImplementation(function () {
    return {
        userid: 1,
        username: "First User",
        password: "1234",
        email: "air.m@gmail.com",
        firstname: "a",
        lastname: "m",
        bio: "b",
        salt: "1223f",
        profilepic: "path/to/pic",
        setUserid: jest.fn(function (value) { }),
        getUserid: jest.fn(function () { return 1; }),
        setUsername: jest.fn(function (value) { }),
        getUsername: jest.fn(function () { return "Other User"; }),
        setPassword: jest.fn(function (value) { }),
        getPassword: jest.fn(function () { return "1234"; }),
        setEmail: jest.fn(function (value) { }),
        getEmail: jest.fn(function () { return "air.m@gmail.com"; }),
        setFirstname: jest.fn(function (value) { }),
        getFirstname: jest.fn(function () { return "a"; }),
        setLastname: jest.fn(function (value) { }),
        getLastname: jest.fn(function () { return "m"; }),
        setBio: jest.fn(function (value) { }),
        getBio: jest.fn(function () { return "b"; }),
        setSalt: jest.fn(function (value) { }),
        getSalt: jest.fn(function () { return "1223f"; }),
        setProfilePicPath: jest.fn(function (value) { }),
        getProfilePicPath: jest.fn(function () { return "path/to/pic"; })
    };
});
exports.default = mock;
