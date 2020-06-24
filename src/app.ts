import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import hbs from 'hbs'; //templating engine
import Directory from './Directory/directory';
import UserRepository from './User/SqliteRepository';
import IUserRepository from './User/IRepository';
import UserController from './User/UserController';
import { createDB } from './dbinit';


//Used for development database changes. 
// createDB().then(() => {
//   console.log("Inited");
// }).catch(e => {
//   console.log(e);
// })

// Create a new express app instance
const app: express.Application = express();

//direct express middleware to use routes/settings
app.use(bodyParser.json())

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
let viewsPath: string = path.join(__dirname, '../src/Views');
//Direct express to use files in the views directory -- TODO: Better explanation. 
app.set('views', viewsPath);

//Define path to the application's partial views 
let partialViewsPath: string = path.join(__dirname, '../src/Views/Partials');
hbs.registerPartials(partialViewsPath);

//Setup the app's filesystem 
let staticDirectory: Directory = new Directory();
staticDirectory.registerRoutes(app); //TODO: Rename method

//register the user routes -- (could also have set up controllers which have the routes baked in)
let userRepo: IUserRepository = new UserRepository();
let usercont: UserController = new UserController(userRepo);
usercont.registerRoutes(app);

//Current State:
//Authentication: Handled with jwts. Profile, profile edit, and homepage route are guarded with auth. JWTS are sent with cookies
//Homepage: Homepage is not on root yet. Will need a homepage that uses js to dynamically decide how to load page based off if a user is logged in or not. 

//TODO: Add blog table to database: 
//                                 1 to Many relationship with users
//                                 Username is the foreign key in the blog table
//                                 BlogId is pk 
//                                 Blog Title 
//                                 Blog Text 
//                                 Blog Images


export default app; 