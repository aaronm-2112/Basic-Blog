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
var SqliteRepository_1 = __importDefault(require("./User/Repositories/SqliteRepository"));
var UserController_1 = __importDefault(require("./User/UserController"));
var BlogSQLiteRepo_1 = __importDefault(require("./Blog/Repositories/BlogSQLiteRepo"));
var BlogController_1 = __importDefault(require("./Blog/BlogController"));
var Uploads_1 = __importDefault(require("./Common/Resources/Uploads"));
var PGSQLiteRepo_1 = __importDefault(require("./User/Repositories/PGSQLiteRepo"));
var BlogPGSQLRepo_1 = __importDefault(require("./Blog/Repositories/BlogPGSQLRepo"));
//TODO: Add Location headers in all post request responses to client.
//TODO: Make userid primary key and actually reference it in the blogs table of PGSQL database implementation and SQLIte implementation. 
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
app.use(body_parser_1.default.urlencoded({
    extended: true
}));
//static path we need to set up
//To operate with images (or other static files) with Node.js configure static paths
app.use('/uploads', express_1.default.static('uploads'));
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
var viewsPath = path_1.default.join(__dirname, '../Views');
//Direct express to use files in the views directory -- TODO: Better explanation. 
app.set('views', viewsPath);
//Define path to the application's partial views 
var partialViewsPath = path_1.default.join(__dirname, '../Views/Partials');
hbs_1.default.registerPartials(partialViewsPath);
//Setup the app's filesystem 
var staticDirectory = new directory_1.default();
staticDirectory.registerRoutes(app); //TODO: Rename method
//register the user routes -- (could also have set up controllers which have the routes baked in)
var userRepo = new SqliteRepository_1.default();
var userRepoPostgre = new PGSQLiteRepo_1.default();
var blogRepo = new BlogSQLiteRepo_1.default();
var blogRepoPostgre = new BlogPGSQLRepo_1.default();
var usercont = new UserController_1.default(userRepoPostgre, blogRepoPostgre);
usercont.registerRoutes(app);
//register the blog routes 
var blogrepo = new BlogSQLiteRepo_1.default();
var blogcontroller = new BlogController_1.default(blogRepo);
blogcontroller.registerRoutes(app);
//register the common upload route
Uploads_1.default(app).then(function (res) {
    console.log("Uploads registered.");
}).catch(function (e) { return console.log(e); });
//Current State:
//Authentication: Handled with jwts. Profile, profile edit, and homepage route are guarded with auth. JWTS are sent with cookies
//Homepage: Homepage is not on root yet. Will need a homepage that uses js to dynamically decide how to load page based off if a user is logged in or not. 
exports.default = app;
