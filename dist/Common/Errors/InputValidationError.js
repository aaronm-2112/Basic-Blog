"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var CustomError_1 = require("./CustomError");
var InputValidationError = /** @class */ (function (_super) {
    __extends(InputValidationError, _super);
    function InputValidationError(errors) {
        var _this = _super.call(this, "Input validation errors") || this;
        _this.errors = errors;
        _this.statusCode = 400;
        Object.setPrototypeOf(_this, InputValidationError.prototype);
        return _this;
    }
    InputValidationError.prototype.serializeErrors = function () {
        console.log(this.errors);
        return this.errors.map(function (error) {
            return {
                message: error.msg,
                field: error.param
            };
        });
    };
    return InputValidationError;
}(CustomError_1.CustomError));
exports.InputValidationError = InputValidationError;
