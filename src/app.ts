import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import hbs from 'hbs'; //templating engine
import Directory from './Directory/directory';
import IUserRepository from './User/Repositories/IRepository';
import UserController from './User/UserController';
import { createDB } from './dbinit';
import IBlogRepository from './Blog/Repositories/IBlogRepository';
import IController from './Controllers/IController';
import BlogController from './Blog/BlogController';
import Upload from './Common/Resources/Uploads';
import login from './Common/login';
import UserPGSQLRepo from './User/Repositories/PGSQLRepo';
import BlogPGSQLRepo from './Blog/Repositories/BlogPGSQLRepo';
import CommentPGSQLRepo from './Comment/Repositories/CommentPGSQLRepo';
import CommentController from './Comment/CommentController';

//TODO: Make userid primary key and actually reference it in the blogs table of PGSQL database implementation and SQLIte implementation. 
//TODO: Add indices to the database properties being used for keyset pagination.
//TODO: 1. Finish homepage refactor.                                   DONE
//      2. Review all endpoints to ensure they follow REST guidelines. DONE
//      3. Refactor any endpoints that do not.                         DONE
//      4. Add rate limiting to the endpoints.                         Do After cloud move
//      5. Test with Postman and any unit tests required for the models. Refactor controller applicaiton logic into models while doing so. 
//      6. Add indices to the database to improve pagination speed.


//Used for development database changes. 
// createDB().then(() => {
//   console.log("Inited");
// }).catch(e => {
//   console.log(e);
// })

// Create a new express app instance
const app: express.Application = express();

//direct express middleware to use routes/settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//static path we need to set up
//To operate with images (or other static files) with Node.js configure static paths
app.use('/uploads', express.static('uploads'));

// Express Middleware for serving static scripts
app.use('/scripts', express.static('scripts'));

//tell app to use the cookie parser
app.use(cookieParser());

//use cors
app.use(cors({
  origin: [
    'http://localhost:3000'
  ],
  credentials: true
}));

// Only parse query parameters into strings, not objects
app.set('query parser', 'simple');

//Direct express to use Handlebars templating engine for rendering the app's pages
app.set('view engine', 'hbs');

//Define path to the directory of the application's views
let viewsPath: string = path.join(__dirname, '../Views');
//Direct express to use files in the views directory -- TODO: Better explanation. 
app.set('views', viewsPath);

//Define path to the application's partial views 
let partialViewsPath: string = path.join(__dirname, '../Views/Partials');
hbs.registerPartials(partialViewsPath);


//register the user routes
let userRepoPostgre: IUserRepository = new UserPGSQLRepo();
let blogRepoPostgre: IBlogRepository = new BlogPGSQLRepo();
let usercont: UserController = new UserController(userRepoPostgre, blogRepoPostgre);
usercont.registerRoutes(app);

//register the blog routes 
let blogcontroller: IController = new BlogController(blogRepoPostgre);
blogcontroller.registerRoutes(app);

//register the comment routes
let commentRepo: CommentPGSQLRepo = new CommentPGSQLRepo();
let commentcontroller: IController = new CommentController(commentRepo);
commentcontroller.registerRoutes(app);

//register the common routes-----------------

//route for uploading blog title and profile images
Upload(app).then(res => {
  console.log("Uploads registered.");
}).catch(e => console.log(e));

login(app, userRepoPostgre).then(res => {
  console.log("Login registered");
}).catch(e => console.log(e));

//Setup the app's filesystem 
let staticDirectory: Directory = new Directory();
staticDirectory.registerRoutes(app);




















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

export default app;



