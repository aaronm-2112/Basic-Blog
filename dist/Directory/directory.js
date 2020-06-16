"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Purpose: Define the filesystem for the application. 
var express = __importStar(require("express"));
var Auth_1 = __importDefault(require("../Auth/Auth"));
var Directory = /** @class */ (function () {
    //setup jwt authentication on the guarded router
    function Directory() {
        //routes that do not need to be authguarded
        this.unguardedRouter = express.Router();
        //routes that need to be authguarded
        this.guardedRouter = express.Router();
        //all the paths in the filesystem that can be reached through normal user navigation
        this.paths = { root: '/', signup: '/signup', login: '/login', search: '/search', profile: '/profile/:userId', homepage: '/homepage' };
        this.auth = new Auth_1.default();
        this.guardedRouter.use(this.auth.authenitcateJWT);
    }
    //direct express middleware to render the paths using handlebars
    Directory.prototype.registerRoutes = function (app) {
        var _this = this;
        //render root path
        this.unguardedRouter.get("" + this.paths.root, function (req, res) {
            res.redirect('http://localhost:3000/homepage');
        });
        this.guardedRouter.get("" + this.paths.homepage, function (req, res) {
            res.render('Homepage');
        });
        //render search path
        this.unguardedRouter.get("" + this.paths.search, function (req, res) {
            res.render('Search', _this.paths);
        });
        this.unguardedRouter.get("" + this.paths.signup, function (req, res) {
            res.render('Signup');
        });
        this.unguardedRouter.get("" + this.paths.login, function (req, res) {
            res.render('Login');
        });
        // //render profile path
        // this.guardedRouter.get(`${this.paths.profile}`, (req: Request, res: Response) => {
        //   res.render('Profile', this.paths)
        // })
        //render wildcard path
        // this.unguardedRouter.get('*', (req: Request, res: Response) => {
        //   res.send("Wow nothing there").status(200);
        // });
        //Tell express to use these routes
        app.use(this.unguardedRouter);
        app.use(this.guardedRouter);
    };
    return Directory;
}());
exports.default = Directory;
