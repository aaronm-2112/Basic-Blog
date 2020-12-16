"use strict";
// Purpose: An easily extensible middleware that places error handling and client response code in one spot
Object.defineProperty(exports, "__esModule", { value: true });
var CustomError_1 = require("../Common/Errors/CustomError");
exports.handler = function (err, req, res, next) {
    // check if the incoming error is a custom error 
    if (err instanceof CustomError_1.CustomError) {
        // send the user the error message
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    // log any errors that were unexpected
    console.log(err);
    // send a generic error status and message back to the user (this error type is unexpected)
    res.status(400).send("Something went wrong with your request");
};
