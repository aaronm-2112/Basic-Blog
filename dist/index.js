"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
app_1.default.listen(3000, function (err) {
    if (err) {
        return console.error(err);
    }
    return console.log("server is listening on 3000");
});
//createDB().then(() => console.log("Cool"))
