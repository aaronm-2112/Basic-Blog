import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import 'express-async-errors'
import cors from 'cors';
import path from 'path';
import hbs from 'hbs'; //templating engine
import Directory from './Directory/directory';
import IUserRepository from './User/Repositories/IRepository';
import UserController from './User/UserController';
import { createDB, resetDB } from './dbinit';
import config from './Common/PGConfig';
import PGConnection from './Common/PGConnection';
import IBlogRepository from './Blog/Repositories/IBlogRepository';
import IController from './Controllers/IController';
import BlogController from './Blog/BlogController';
import Upload from './Common/Resources/Uploads';
import login from './Common/login';
import UserPGSQLRepo from './User/Repositories/UserPGSQLRepo';
import BlogPGSQLRepo from './Blog/Repositories/BlogPGSQLRepo';
import CommentPGSQLRepo from './Comments/Repositories/CommentPGSQLRepo';
import CommentController from './Comments/CommentController';
import { rateLimiterUsingThirdParty } from './Common/RateLimiter'
import csp from "helmet-csp";
import { handler } from './Middlewares/error-handler'
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
let CURRENT_ENV = process.argv[process.argv.length - 1];

//create the connection config object for PGSQL
let connection: PGConnection = config(CURRENT_ENV);

//Used for development database changes. 
if (CURRENT_ENV !== 'PROD') {
  resetDB(connection).then(() => {
    createDB(connection)
  }).then(() => {
    console.log("DB Inited")
  }).catch(e => {
    console.log(e);
  })
} else { //production environment
  createDB(connection).then(() => {
    console.log("Database Initialized");
  })
}



// Create a new express app instance
const app: express.Application = express();

//direct express middleware to use routes/settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//rate limit to 5000 requests every 24 hrs
app.use(rateLimiterUsingThirdParty);

//use cors [not utilized much in the project]
app.use(cors({
  origin: [
    'http://localhost:3000'
  ],
  credentials: true
}));


app.use(
  csp({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      upgradeInsecureRequests: [],
    },
    reportOnly: false,
  })
);

//static path we need to set up
//To operate with images (or other static files) with Node.js configure static paths
app.use('/uploads', express.static('uploads'));

// Express Middleware for serving static scripts
app.use('/scripts', express.static('scripts'));

//tell app to use the cookie parser
app.use(cookieParser());


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
let userRepoPostgre: IUserRepository = new UserPGSQLRepo(connection);
let blogRepoPostgre: IBlogRepository = new BlogPGSQLRepo(connection);
let usercont: UserController = new UserController(userRepoPostgre, blogRepoPostgre);
usercont.registerRoutes(app);

//register the blog routes 
let blogcontroller: IController = new BlogController(blogRepoPostgre);
blogcontroller.registerRoutes(app);

//register the comment routes
let commentRepo: CommentPGSQLRepo = new CommentPGSQLRepo(connection);
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

// catch errors 
app.use(handler)

export default app;



