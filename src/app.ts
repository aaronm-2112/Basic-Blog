import express from 'express';
import bodyParser from 'body-parser';
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

export default app; 