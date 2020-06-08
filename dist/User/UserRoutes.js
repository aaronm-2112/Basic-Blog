"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserRoutes = /** @class */ (function () {
    function UserRoutes(userController) {
        this.controller = userController;
    }
    UserRoutes.prototype.registerRoutes = function (app) {
        app.post("/signup", this.controller.signUp);
    };
    return UserRoutes;
}());
exports.default = UserRoutes;
