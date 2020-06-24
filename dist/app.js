"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var hbs_1 = __importDefault(require("hbs")); //templating engine
var directory_1 = __importDefault(require("./Directory/directory"));
var SqliteRepository_1 = __importDefault(require("./User/SqliteRepository"));
var UserController_1 = __importDefault(require("./User/UserController"));
//Used for development database changes. 
// createDB().then(() => {
//   console.log("Inited");
// }).catch(e => {
//   console.log(e);
// })
// Create a new express app instance
var app = express_1.default();
//direct express middleware to use routes/settings
app.use(body_parser_1.default.json());
//tell app to use the cookie parser
app.use(cookie_parser_1.default());
//use cors
app.use(cors_1.default({
    origin: [
        'http://localhost:3000'
    ],
    credentials: true
}));
//Direct express to use Handlebars templating engine for rendering the app's pages
app.set('view engine', 'hbs');
//Define path to the directory of the application's views
var viewsPath = path_1.default.join(__dirname, '../src/Views');
//Direct express to use files in the views directory -- TODO: Better explanation. 
app.set('views', viewsPath);
//Define path to the application's partial views 
var partialViewsPath = path_1.default.join(__dirname, '../src/Views/Partials');
hbs_1.default.registerPartials(partialViewsPath);
//Setup the app's filesystem 
var staticDirectory = new directory_1.default();
staticDirectory.registerRoutes(app); //TODO: Rename method
//register the user routes -- (could also have set up controllers which have the routes baked in)
var userRepo = new SqliteRepository_1.default();
var usercont = new UserController_1.default(userRepo);
usercont.registerRoutes(app);
//TODO: 
//Homepage, Profile, and profile edit are "firewalled" by jwts -- failure to authenticate should redirect to signup or login depending upon the situation --Use an http interceptor with Express to grab JWTs that are not sent in the header (b/c it was not an http request sent from within the site) from local storage. This ensures if someone is logged in they will be able tonav to pages they should be allowed in. 
//Consider adding front end checks for if a user is logged in or not as well by checking expiration timer. 
//Overall plan: 
//1. Send http request to site 
//2. Intercept request to check for token in storage or header
//3. Go to Auth middleware for guarded routes 
//4. Redirect to signup if auth fails direct to page if succeeds. 
//TODO Priority:
//1. Profile editing path from signup to login to profile editing 
//-setup root to redirect to homepage route and auth guard homepage route  [x]
//Change signup and login to http get requests [o]
//in login http request send jwt in the request as auth header so the homepage can be accessed 
//change navigation partial to send http get requests to webpages that utilize local storage to send the jwt info
//Load profile page with correct user information gathered from the jwt
//2. Blogs
//x[last priority]. Add http interceptors and redirects such that all guarded routes send unathenticated users back to signup. this will make redirect from root to homepage work and make sense
exports.default = app;
