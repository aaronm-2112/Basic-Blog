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
var NotAcceptableError = /** @class */ (function (_super) {
    __extends(NotAcceptableError, _super);
    function NotAcceptableError() {
        var _this = _super.call(this, "Request does not accept Content-Type being returned") || this;
        _this.statusCode = 406;
        Object.setPrototypeOf(_this, NotAcceptableError.prototype);
        return _this;
    }
    return NotAcceptableError;
}(CustomError_1.CustomError));
exports.NotAcceptableError = NotAcceptableError;
