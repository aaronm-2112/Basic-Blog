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
    //setup jwt authentication
    function Directory() {
        //common directory routes
        this.router = express.Router();
        //all the paths in the filesystem that can be reached through normal user navigation
        this.paths = { root: '/', signup: '/signup', login: '/login', search: '/search', profile: '/profile/:userId', homepage: '/homepage' };
        this.auth = new Auth_1.default();
    }
    //direct express middleware to render the paths using handlebars
    Directory.prototype.registerRoutes = function (app) {
        var _this = this;
        //render root path -- for now make unguarded version of homepage
        //TODO: Show alternate version if not authenticated!
        this.router.get("" + this.paths.root, function (req, res) {
            //get the userID from the cookie
            var userID = { id: "" };
            //extract the userid from the jwt 
            _this.auth.setSubject(req.cookies["jwt"], userID);
            console.log(userID);
            //check if any userid was extracted from the jwt
            if (userID.id.length) {
                //if so render the logged in homepage
                res.render('Homepage');
            }
            else {
                //render the homepage that allows the user to sign up or log in
                res.render('HomepageAnonymous');
            }
        });
        this.router.get("" + this.paths.homepage, this.auth.authenitcateJWT, function (req, res) {
            console.log("In homepage route");
            res.render('Homepage');
        });
        //render search path
        this.router.get("" + this.paths.search, function (req, res) {
            res.render('Search', _this.paths);
        });
        this.router.get("" + this.paths.signup, function (req, res) {
            res.render('Signup');
        });
        this.router.get("" + this.paths.login, function (req, res) {
            res.render('Login');
        });
        //render wildcard path -- needs to be after all routes defined in other paths too
        // this.router.get('*', (req: Request, res: Response) => {
        //   res.send("Wow nothing there").status(200);
        // });
        //Use the directory routes at root level 
        app.use('/', this.router);
    };
    return Directory;
}());
exports.default = Directory;
