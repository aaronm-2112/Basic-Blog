"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Purpose: Takes the current NODE_ENV as a control and creates the database connections
var PGConnection_1 = __importDefault(require("./PGConnection"));
function config(node_env) {
    try {
        var connectionObject = new PGConnection_1.default();
        switch (node_env) {
            case process.env.NODE_ENV_DEV:
                connectionObject.setUser(process.env.DB_USER);
                connectionObject.setHost(process.env.DB_HOST);
                connectionObject.setDatabase(process.env.DB_DATABASE);
                connectionObject.setPassword(process.env.DB_PASS);
                connectionObject.setPort(parseInt(process.env.DB_PORT));
                break;
            case process.env.NODE_ENV_TEST:
                connectionObject.setUser(process.env.DB_USER);
                connectionObject.setHost(process.env.DB_HOST);
                connectionObject.setDatabase(process.env.DB_DATABASE_TEST);
                connectionObject.setPassword(process.env.DB_PASS);
                connectionObject.setPort(parseInt(process.env.DB_PORT));
                break;
            case process.env.NODE_ENV_PROD:
                throw new Error("No production setup yet");
            default:
                throw new Error("No environment selected");
        }
        return connectionObject;
    }
    catch (e) {
        throw new Error(e);
    }
}
exports.default = config;
