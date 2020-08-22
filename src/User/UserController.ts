import IUserRepository from "./Repositories/IRepository";
import IUser from './IUser';
import User from './User';
import Auth from '../Auth/Auth';
import { Request, Response, Router } from 'express';
import * as express from 'express';
import IController from "../Controllers/IController";
import { compareUserPassword } from '../Common/salt';
import IBlogRepository from "../Blog/Repositories/IBlogRepository";
import BlogSQLiteRepo from "../Blog/Repositories/BlogSQLiteRepo";
import IBlog from '../Blog/IBlog';
import { searchParameters } from "../Blog/BlogSearchCriteria";
import path from 'path';


//Purpose: Handle all user view behaviour.
//Rather than use a service for representing a compound model I chose to place two repos in the UserControler.
//           Rationale: 
//              b/c a service is used for business logic utilizing repos the lack of such logic in this simple controller 
//              disallows me to justify introducing another abstraction. 
export default class UserController implements IController {

  //TODO: use Inversify for the experience?
  private userRepository: IUserRepository;

  //used for sending blog information to the Profile view
  private blogRepo: IBlogRepository;

  //Router
  private router: Router; // used for login

  //Auth
  private auth: Auth;

  constructor(userRepo: IUserRepository, blogRepo: IBlogRepository) {
    // setup the user repository 
    this.userRepository = userRepo;
    // setup the unguarded router 
    this.router = express.Router();
    // setup authentication-- TODO: Make a singleton?
    this.auth = new Auth();
    //setup blog repository
    this.blogRepo = blogRepo;

  }

  registerRoutes(app: express.Application): void {

    //UNGUARDED ROUTES------------------------------------------------------------------

    //SIGNUP
    this.router.post('/signup', async (req: Request, res: Response) => {
      try {
        //create the user with the information provided in the request
        let user: IUser = new User();
        user.setUsername(req.body.username);
        user.setEmail(req.body.email);
        user.setPassword(req.body.password);

        console.log(user);

        //insert the user into the database 
        let userInserted: Boolean = await this.userRepository.create(user);

        // if insertion successful return success
        if (userInserted) {
          // TODO: Render a login page
          res.sendStatus(201);
        } else { // else return failure 
          res.sendStatus(400);
        }
      } catch (e) {
        console.log(e);
        res.sendStatus(400);
      }
    })

    //LOGIN
    this.router.post("/login", async (req: Request, res: Response) => {
      try {
        // Verify username and password passsed in
        let username: string = req.body.username;
        let password: string = req.body.password;

        //grab the user from the database 
        let user: IUser = await this.userRepository.find(username); //TODO: Make username a PK and unique

        // TODO: Test this error handling
        if (!user) {
          res.status(400).send();
          return;
        }

        //compare incoming password with database password hash for the user
        let samePassword: boolean = await compareUserPassword(password, user.getPassword());

        if (!samePassword) {
          //stop execution-- incorrect password
          res.sendStatus(400);
          return;
        }

        console.log(user);
        //create the bearer token for the user
        const jwtBearerToken: string = this.auth.createJWT(user);

        console.log(jwtBearerToken);
        //send back the bearer token to the user KEY: Too long to be secure. Usually other tactics as well are used. But this is practice. 
        //res.status(200).send({ "idToken": jwtBearerToken, "expiresIn": "2 days" }) //TODO: Make configurable but is fine for now.
        //cookies are sent automaticlaly with every request
        res.cookie('jwt', jwtBearerToken, {
          expires: new Date(Date.now() + 1728000),
          secure: false, //true when using https
          httpOnly: true
        }).sendStatus(200);


      } catch (e) {
        console.log("Login post" + e);
        res.sendStatus(400);
      }
    })

    //GUARDED ROUTES------------------------------------------------------------------------------------------------------------------

    this.router.get("/profile", this.auth.authenitcateJWT, async (req: Request, res: Response) => {
      try {
        //grab subject information out of res.locals 
        let username: string = res.locals.userId;  //TODO: Add error checking

        //get the blogid -- the keyset pagination key
        let blogid: string = req.query.key as string;
        console.log(blogid);
        //get the key conditional -- can be lt(<) or gt(>)
        let keyCondition: string = req.query.keyCondition as string;

        //Get the user information 
        let user: IUser = await this.userRepository.find(username); //TODO: Make username a PK and unique

        //Get the user's blogs
        let blogs: IBlog[] = await this.blogRepo.findAll(searchParameters.Username, (user.username as string), blogid, keyCondition);

        //store front end blog information
        let blogDetails: Array<{ title: string, editPath: string, viewPath: string }> = new Array<{ title: string, editPath: string, viewPath: string }>();

        //Extract the title and blogID and place them into a structure with the paths to edit and view blogs
        blogs.forEach(blog => {
          blogDetails.push({ title: blog.title, editPath: `http://localhost:3000/blog/${blog.blogid}/true`, viewPath: `http://localhost:3000/blog/${blog.blogid}/false` })
        });

        //  1. Send user profile info to profile partial
        res.render('Profile', {
          userName: user.getUsername(), firstName: user.getFirstname(),
          lastName: user.getLastname(), bio: user.getBio(),
          blogDetails: blogDetails,
          profileImagePath: user.getProfilePicPath()
        });

      } catch (e) {
        console.log("profile get" + e);
        res.sendStatus(400);
      }
    })

    //TODO: Allow editing to happen on the Profile page instead of on a separate page
    this.router.get("/profile/edit", this.auth.authenitcateJWT, async (req: Request, res: Response) => {
      try {
        //grab username out of the local vars
        let username: string = res.locals.userId //TODO: Add error checking

        //Get the user information 
        let user: IUser = await this.userRepository.find(username);

        //set path to the image from the Views directory [views are in /Views] using absolute paths
        //TODO: Use env to get absolute path not hardcoded string
        //let imagePath: string = "http://localhost:3000/" + path.normalize(user.getProfilePicPath());


        //  1. Send user profile info to profile edit
        res.render('ProfileEdit', {
          userName: user.getUsername(), firstName: user.getFirstname(),
          lastName: user.getLastname(), bio: user.getBio(), profileImagePath: user.getProfilePicPath()
        });

      } catch (e) {
        console.error("Profile edit get" + e);
        res.sendStatus(400);
      }
    })

    //TODO: Security checks
    //TOOD: Refactor into a route that points to a resource?
    //TODO: Refactor into a Put or Patch request
    this.router.post("/profile/edit", this.auth.authenitcateJWT, async (req: Request, res: Response) => {
      try {
        //Retrieve user id
        let userName: string = res.locals.userId;

        //retrieve user profile edits
        let firstName: string = req.body.firstName;
        let lastName: string = req.body.lastName;
        let bio: string = req.body.bio;
        let profilePicPath: string = req.body.profilePicturePath;

        console.log(profilePicPath);

        //populate user information in the user object
        let user: IUser = new User();
        user.setUsername(userName);

        if (req.body.firstName !== null && req.body.firstName !== undefined) {
          user.setFirstname(firstName);
        }

        //blog title
        if (req.body.lastName !== null && req.body.lastName !== undefined) {
          user.setLastname(lastName);
        }

        //blog's path to titleimage
        if (req.body.bio !== null && req.body.bio !== undefined) {
          user.setBio(bio);
        }

        //blog's username value -- TODO: Determine if this is necessary here
        if (req.body.profilePicturePath !== null && req.body.profilePicturePath !== undefined) {
          user.setProfilePicPath(profilePicPath);
        }

        console.log(user.getProfilePicPath());


        //update the user information in the database
        await this.userRepository.update(user);

        let newuser: IUser = await this.userRepository.find(user.getUsername() as string);

        console.log(newuser);

        res.sendStatus(200);

      } catch (e) {
        console.error("Profile edit post" + e);
        res.sendStatus(400);
      }

    })

    // register the routes
    app.use(this.router);
  }
}