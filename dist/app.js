"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var path_1 = __importDefault(require("path"));
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
//Direct express to use Handlebars templating engine for rendering the app's pages
app.set('view engine', 'hbs');
//Define path to the directory of the application's views
var viewsPath = path_1.default.join(__dirname, '../src/Views');
//Direct express to use files in the views directory -- TODO: Better explanation. 
app.set('views', viewsPath);
//Setup the app's filesystem 
var staticDirectory = new directory_1.default();
staticDirectory.registerRoutes(app); //TODO: Rename method
//register the user routes -- (could also have set up controllers which have the routes baked in)
var userRepo = new SqliteRepository_1.default();
var usercont = new UserController_1.default(userRepo);
usercont.registerRoutes(app);
exports.default = app;
