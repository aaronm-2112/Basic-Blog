"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
require("express-async-errors");
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var hbs_1 = __importDefault(require("hbs")); //templating engine
var directory_1 = __importDefault(require("./Directory/directory"));
var UserController_1 = __importDefault(require("./User/UserController"));
var dbinit_1 = require("./dbinit");
var PGConfig_1 = __importDefault(require("./Common/PGConfig"));
var BlogController_1 = __importDefault(require("./Blog/BlogController"));
var Uploads_1 = __importDefault(require("./Common/Resources/Uploads"));
var login_1 = __importDefault(require("./Common/login"));
var UserPGSQLRepo_1 = __importDefault(require("./User/Repositories/UserPGSQLRepo"));
var BlogPGSQLRepo_1 = __importDefault(require("./Blog/Repositories/BlogPGSQLRepo"));
var CommentPGSQLRepo_1 = __importDefault(require("./Comments/Repositories/CommentPGSQLRepo"));
var CommentController_1 = __importDefault(require("./Comments/CommentController"));
var RateLimiter_1 = require("./Common/RateLimiter");
var helmet_csp_1 = __importDefault(require("helmet-csp"));
var error_handler_1 = require("./Middlewares/error-handler");
/*
TODO:
     1. Finish homepage refactor.                                              [DONE]
     2. Review all endpoints to ensure they follow REST guidelines.            [DONE]
     3. Refactor any endpoints that do not.                                    [DONE]
     4. Add rate limiting to the endpoints.                                    [Done]
     5. Test with Postman and any unit tests required for the models.
        Refactor controller applicaiton logic into models while doing so.      [Done]
     6. Setup multiple environments - test, dev, prod                          [Done]
     7. Basic testing of the database queries using a test database            [DONE]
     8. Add indices to the database to improve pagination speed.               [DONE]
     9. Refactor interfaces into base classes                                  [Done*]
*/
//Set the node environment variable
var CURRENT_ENV = process.argv[process.argv.length - 1];
//create the connection config object for PGSQL
var connection = PGConfig_1.default(CURRENT_ENV);
//Used for development database changes. 
if (CURRENT_ENV !== 'PROD') {
    dbinit_1.resetDB(connection).then(function () {
        dbinit_1.createDB(connection);
    }).then(function () {
        console.log("DB Inited");
    }).catch(function (e) {
        console.log(e);
    });
}
else { //production environment
    dbinit_1.createDB(connection).then(function () {
        console.log("Database Initialized");
    });
}
// Create a new express app instance
var app = express_1.default();
//direct express middleware to use routes/settings
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true
}));
//rate limit to 5000 requests every 24 hrs
app.use(RateLimiter_1.rateLimiterUsingThirdParty);
//use cors [not utilized much in the project]
app.use(cors_1.default({
    origin: [
        'http://localhost:3000'
    ],
    credentials: true
}));
app.use(helmet_csp_1.default({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        upgradeInsecureRequests: [],
    },
    reportOnly: false,
}));
//static path we need to set up
//To operate with images (or other static files) with Node.js configure static paths
app.use('/uploads', express_1.default.static('uploads'));
// Express Middleware for serving static scripts
app.use('/scripts', express_1.default.static('scripts'));
//tell app to use the cookie parser
app.use(cookie_parser_1.default());
// Only parse query parameters into strings, not objects
app.set('query parser', 'simple');
//Direct express to use Handlebars templating engine for rendering the app's pages
app.set('view engine', 'hbs');
//Define path to the directory of the application's views
var viewsPath = path_1.default.join(__dirname, '../Views');
//Direct express to use files in the views directory -- TODO: Better explanation. 
app.set('views', viewsPath);
//Define path to the application's partial views 
var partialViewsPath = path_1.default.join(__dirname, '../Views/Partials');
hbs_1.default.registerPartials(partialViewsPath);
//register the user routes
var userRepoPostgre = new UserPGSQLRepo_1.default(connection);
var blogRepoPostgre = new BlogPGSQLRepo_1.default(connection);
var usercont = new UserController_1.default(userRepoPostgre, blogRepoPostgre);
usercont.registerRoutes(app);
//register the blog routes 
var blogcontroller = new BlogController_1.default(blogRepoPostgre);
blogcontroller.registerRoutes(app);
//register the comment routes
var commentRepo = new CommentPGSQLRepo_1.default(connection);
var commentcontroller = new CommentController_1.default(commentRepo);
commentcontroller.registerRoutes(app);
//register the common routes-----------------
//route for uploading blog title and profile images
Uploads_1.default(app).then(function (res) {
    console.log("Uploads registered.");
}).catch(function (e) { return console.log(e); });
login_1.default(app, userRepoPostgre).then(function (res) {
    console.log("Login registered");
}).catch(function (e) { return console.log(e); });
//Setup the app's filesystem 
var staticDirectory = new directory_1.default();
staticDirectory.registerRoutes(app);
// catch errors 
app.use(error_handler_1.handler);
exports.default = app;
