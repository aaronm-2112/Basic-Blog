"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_validator_1 = require("express-validator");
var InputValidationError_1 = require("../Common/Errors/InputValidationError");
exports.validateRequest = function (req, res, next) {
    var errors = express_validator_1.validationResult(req).array();
    if (errors.length) {
        throw new InputValidationError_1.InputValidationError(errors);
    }
    next();
};
