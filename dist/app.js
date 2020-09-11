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
var UserController_1 = __importDefault(require("./User/UserController"));
var BlogController_1 = __importDefault(require("./Blog/BlogController"));
var Uploads_1 = __importDefault(require("./Common/Resources/Uploads"));
var PGSQLRepo_1 = __importDefault(require("./User/Repositories/PGSQLRepo"));
var BlogPGSQLRepo_1 = __importDefault(require("./Blog/Repositories/BlogPGSQLRepo"));
var CommentPGSQLRepo_1 = __importDefault(require("./Comment/Repositories/CommentPGSQLRepo"));
var CommentController_1 = __importDefault(require("./Comment/CommentController"));
//TODO: Add Location headers in all post request responses to client.
//TODO: Make userid primary key and actually reference it in the blogs table of PGSQL database implementation and SQLIte implementation. 
//TODO: Add indices to the database properties being used for keyset pagination.
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
// Express Middleware for serving static scripts
app.use('/scripts', express_1.default.static('scripts'));
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
var userRepoPostgre = new PGSQLRepo_1.default();
//let blogRepo: IBlogRepository = new BlogSQLiteRepo();
var blogRepoPostgre = new BlogPGSQLRepo_1.default();
var usercont = new UserController_1.default(userRepoPostgre, blogRepoPostgre);
usercont.registerRoutes(app);
//register the blog routes 
var blogcontroller = new BlogController_1.default(blogRepoPostgre);
blogcontroller.registerRoutes(app);
//create the comment repo
var commentRepo = new CommentPGSQLRepo_1.default();
//register the comment routes
var commentcontroller = new CommentController_1.default(commentRepo);
commentcontroller.registerRoutes(app);
//register the common upload route
Uploads_1.default(app).then(function (res) {
    console.log("Uploads registered.");
}).catch(function (e) { return console.log(e); });
// //create 15 blogs
// for (let i = 0; i < 15; i++) {
//   let blog: IBlog = new Blog();
//   blog.title = `Blog ${i}`;
//   blog.content = `The ${i}th/rd blog.`;
//   blog.titleimagepath = "/uploads/e8cb2abb7301b20d4abb46d0679357ad";
//   blog.username = "First User";
//   blogRepoPostgre.create(blog).then(r => console.log(r));
// }
//create the commnet repository
//let commentRepo: CommentPGSQLRepo = new CommentPGSQLRepo();
//create 20
// for (let i = 0; i < 20; i++) {
//   let comment: IComment = new Comment();
//   comment.blogid = i + 1;
//   comment.content = `Reply #${i}`;
//   comment.deleted = false;
//   if (i === 10 || i === 11) {
//     comment.likes = 9;
//   } else {
//     comment.likes = i + 1;
//   }
//   comment.replyto = 1;
//   comment.username = "First User";
//   commentRepo.create(comment).then(c => { console.log("comment created") }).catch(e => { console.log(e) });
// }
// let comment: IComment = new Comment();
// comment.blogid = 21;
// comment.content = `Reply 21`;
// comment.deleted = false;
// comment.likes = 1;
// comment.replyto = 1;
// comment.username = "First User";
// commentRepo.create(comment).then(c => { console.log("comment created") }).catch(e => { console.log(e) });
// let comments: IComment[] = [];
// commentRepo.findAll(true, 1, "likes", 1000, 1000).then(comments => {
//   //console.log(comments);
// }).catch(e => {
//   console.log(e);
// })
//Current State:
//Authentication: Handled with jwts. Profile, profile edit, and homepage route are guarded with auth. JWTS are sent with cookies
//Homepage: Homepage is not on root yet. Will need a homepage that uses js to dynamically decide how to load page based off if a user is logged in or not. 
exports.default = app;
