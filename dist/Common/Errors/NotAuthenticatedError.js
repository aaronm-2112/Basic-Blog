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
var NotAuthenticatedError = /** @class */ (function (_super) {
    __extends(NotAuthenticatedError, _super);
    function NotAuthenticatedError() {
        var _this = _super.call(this, "User is not logged in") || this;
        _this.statusCode = 401;
        Object.setPrototypeOf(_this, NotAuthenticatedError.prototype);
        return _this;
    }
    NotAuthenticatedError.prototype.serializeErrors = function () {
        return [{
                "message": this.message
            }];
    };
    return NotAuthenticatedError;
}(CustomError_1.CustomError));
exports.NotAuthenticatedError = NotAuthenticatedError;
