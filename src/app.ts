import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import hbs from 'hbs'; //templating engine
import Directory from './Directory/directory';
import UserRepository from './User/Repositories/SqliteRepository';
import IUserRepository from './User/Repositories/IRepository';
import UserController from './User/UserController';
import { createDB } from './dbinit';
import IBlogRepository from './Blog/Repositories/IBlogRepository';
import BlogSQLiteRepo from './Blog/Repositories/BlogSQLiteRepo';
import IController from './Controllers/IController';
import BlogController from './Blog/BlogController';
import Upload from './Common/Resources/Uploads';
import IUser from './User/IUser';
import User from './User/User';
import UserPGSQLRepo from './User/Repositories/PGSQLRepo';
import BlogPGSQLRepo from './Blog/Repositories/BlogPGSQLRepo';
import IBlog from './Blog/IBlog';
import Blog from './Blog/Blog';
import IComment from './Comment/IComment';
import Comment from './Comment/Comment';
import CommentPGSQLRepo from './Comment/Repositories/CommentPGSQLRepo';

//TODO: Add Location headers in all post request responses to client.
//TODO: Make userid primary key and actually reference it in the blogs table of PGSQL database implementation and SQLIte implementation. 

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


//tell app to use the cookie parser
app.use(cookieParser());

//use cors
app.use(cors({
  origin: [
    'http://localhost:3000'
  ],
  credentials: true
}));

//Direct express to use Handlebars templating engine for rendering the app's pages
app.set('view engine', 'hbs');


//Define path to the directory of the application's views
let viewsPath: string = path.join(__dirname, '../Views');
//Direct express to use files in the views directory -- TODO: Better explanation. 
app.set('views', viewsPath);

//Define path to the application's partial views 
let partialViewsPath: string = path.join(__dirname, '../Views/Partials');
hbs.registerPartials(partialViewsPath);

//Setup the app's filesystem 
let staticDirectory: Directory = new Directory();
staticDirectory.registerRoutes(app); //TODO: Rename method

//register the user routes -- (could also have set up controllers which have the routes baked in)
let userRepo: IUserRepository = new UserRepository();
let userRepoPostgre: IUserRepository = new UserPGSQLRepo();
//let blogRepo: IBlogRepository = new BlogSQLiteRepo();
let blogRepoPostgre: IBlogRepository = new BlogPGSQLRepo();
let usercont: UserController = new UserController(userRepoPostgre, blogRepoPostgre);
usercont.registerRoutes(app);

//register the blog routes 
//let blogrepo: IBlogRepository = new BlogSQLiteRepo();
let blogcontroller: IController = new BlogController(blogRepoPostgre);
blogcontroller.registerRoutes(app);

//register the common upload route
Upload(app).then(res => {
  console.log("Uploads registered.");
}).catch(e => console.log(e));

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
let commentRepo: CommentPGSQLRepo = new CommentPGSQLRepo();

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



