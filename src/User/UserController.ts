import IUserRepository from "./Repositories/IRepository";
import IUser from './IUser';
import User from './User';
import Auth from '../Auth/Auth';
import { Request, Response, Router } from 'express';
import * as express from 'express';
import IController from "../Controllers/IController";
import IBlogRepository from "../Blog/Repositories/IBlogRepository";
import IBlog from '../Blog/IBlog';


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

    //Create a user -- aka a SIGNUP functionality
    this.router.post('/user', async (req: Request, res: Response) => {
      try {
        //create the user with the information provided in the request
        let user: IUser = new User();
        user.setUsername(req.body.username);
        user.setEmail(req.body.email);
        user.setPassword(req.body.password);

        //insert the user into the database 
        let userid: number = await this.userRepository.create(user);

        //return the userid and status code
        res.status(201).send({ userid });
      }
      catch (e) {
        console.log(e);
        res.sendStatus(400);
      }
    })

    //GUARDED ROUTES------------------------------------------------------------------------------------------------------------------
    this.router.get('/user/:userid', async (req: Request, res: Response) => {

    })



    //TODO: Security checks
    this.router.patch("/user", this.auth.authenitcateJWT, async (req: Request, res: Response) => {
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