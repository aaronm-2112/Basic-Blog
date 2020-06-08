"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//Purpose: Define the filesystem for the application. 
var express = __importStar(require("express"));
var Directory = /** @class */ (function () {
    function Directory() {
        //routes that do not need to be authguarded
        this.unguardedRouter = express.Router();
        //all the paths in the filesystem that can be reached through normal user navigation
        this.paths = { root: '/', search: '/search', profile: '/profile' };
    }
    //direct express middleware to render the paths using handlebars
    Directory.prototype.registerRoutes = function (app) {
        var _this = this;
        //render root path
        this.unguardedRouter.get("" + this.paths.root, function (req, res) {
            res.render('Homepage', _this.paths);
        });
        //render search path
        this.unguardedRouter.get("" + this.paths.search, function (req, res) {
            res.render('Search', _this.paths);
        });
        //render profile path
        this.unguardedRouter.get("" + this.paths.profile, function (req, res) {
            res.render('Profile', _this.paths);
        });
        //render wildcard path
        this.unguardedRouter.get('*', function (req, res) {
            res.send("Wow nothing there").status(200);
        });
        //Tell express to use these routes
        app.use(this.unguardedRouter);
    };
    return Directory;
}());
exports.default = Directory;
