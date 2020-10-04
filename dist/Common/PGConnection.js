"use strict";
//Purpose: Act as a connection settings configuration object for PGSQl repositories. 
Object.defineProperty(exports, "__esModule", { value: true });
var PGConnection = /** @class */ (function () {
    function PGConnection() {
        this.user = "";
        this.host = "";
        this.database = "";
        this.password = "";
        this.port = 0;
    }
    //getters
    PGConnection.prototype.getUser = function () {
        return this.user;
    };
    PGConnection.prototype.getHost = function () {
        return this.host;
    };
    PGConnection.prototype.getDatabase = function () {
        return this.database;
    };
    PGConnection.prototype.getPassword = function () {
        return this.password;
    };
    PGConnection.prototype.getPort = function () {
        return this.port;
    };
    //setters
    PGConnection.prototype.setUser = function (user) {
        this.user = user;
    };
    PGConnection.prototype.setHost = function (host) {
        this.host = host;
    };
    PGConnection.prototype.setDatabase = function (database) {
        this.database = database;
    };
    PGConnection.prototype.setPassword = function (password) {
        this.password = password;
    };
    PGConnection.prototype.setPort = function (port) {
        this.port = port;
    };
    return PGConnection;
}());
exports.default = PGConnection;
