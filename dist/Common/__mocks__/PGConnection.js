"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import this named export into your test file:
var mock = jest.fn().mockImplementation(function () {
    var mockGetUser = jest.fn(function () { return process.env.DB_USER; });
    var mockGetHost = jest.fn(function () { return process.env.DB_HOST; });
    var mockGetDatabase = jest.fn(function () { return process.env.DB_DATABASE_TEST; });
    var mockGetPassword = jest.fn(function () { return process.env.DB_PASS; });
    var mockGetPort = jest.fn(function () { process.env.DB_PORT; });
    return {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE_TEST,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        getUser: mockGetUser,
        getHost: mockGetHost,
        getDatabase: mockGetDatabase,
        getPassword: mockGetPassword,
        getPort: mockGetPort
    };
});
exports.default = mock;
