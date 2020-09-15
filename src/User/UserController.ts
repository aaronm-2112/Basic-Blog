import IUserRepository from "./Repositories/IRepository";
import IUser from './IUser';
import User from './User';
import Auth from '../Auth/Auth';
import { Request, Response, Router } from 'express';
import * as express from 'express';
import IController from "../Controllers/IController";
import IBlogRepository from "../Blog/Repositories/IBlogRepository";
import IBlog from '../Blog/IBlog';
import { searchParameters } from "../Blog/BlogSearchCriteria";

//Purpose: Handle all user view behaviour.
//Rather than use a service for representing a compound model I chose to place two repos in the UserControler.
//           Rationale: 
//              b/c a service is used for business logic utilizing repos the lack of such logic in this simple controller 
//              disallows me to justify introducing another abstraction. 
export default class UserController implements IController {

  //TODO: use Inversify for the experience?
  private userRepository: IUserRepository;

  //used for sending blog information to the Profile view
  private blogRepository: IBlogRepository;

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
    this.blogRepository = blogRepo;

  }

  registerRoutes(app: express.Application): void {
    //Send back all user information needed for the profile and profile edit views.
    //Query parameters: profile, edit
    //TODO: Add default query parameter values that make sense.
    this.router.get('/users/:userid', this.auth.authenitcateJWT, async (req: Request, res: Response) => {
      try {
        //extract the userid from the parameter
        let usernamePassedIn: string = req.params.userid;

        //check if parameter is undefined
        if (usernamePassedIn === undefined) {
          //return error status code if so
          res.sendStatus(400);
          return;
        }

        //decode the username parameter passed in 
        usernamePassedIn = decodeURIComponent(usernamePassedIn);

        console.log(usernamePassedIn);

        //extract the userid from the auth
        let usernameOfUser: string = res.locals.userId;

        console.log(usernameOfUser);

        //check if the userids do not match
        if (usernameOfUser !== usernamePassedIn) {
          //send back frobidden status code
          res.sendStatus(403);
          return;
        }

        //get the user from the user repo
        let user: IUser = await this.userRepository.find(usernamePassedIn);

        //Get the user's first 10 blogs
        let blogs: IBlog[] = await this.blogRepository.findAll(searchParameters.Username, (user.username as string), "0", ">");

        //store front end blog information
        let blogDetails: Array<{ title: string, editPath: string, viewPath: string }> = new Array<{ title: string, editPath: string, viewPath: string }>();

        //Extract the title and blogID and place them into a structure with the paths to edit and view blogs
        blogs.forEach(blog => {
          blogDetails.push({ title: blog.title, editPath: `http://localhost:3000/blogs/${blog.blogid}?edit=true`, viewPath: `http://localhost:3000/blogs/${blog.blogid}?edit=false` })
        });


        //extract the query parameters
        let profile: string = req.query.profile as string;
        let edit: string = req.query.edit as string;

        //check which query parameter was used
        if (profile !== undefined) {
          // send back the user profile view
          res.render('Profile', {
            userName: user.getUsername(), firstName: user.getFirstname(),
            lastName: user.getLastname(), bio: user.getBio(),
            blogDetails: blogDetails,
            profileImagePath: user.getProfilePicPath()
          });
        } else if (edit !== undefined) {
          //send back the user edit view
          res.render('ProfileEdit', {
            userName: user.getUsername(), firstName: user.getFirstname(),
            lastName: user.getLastname(), bio: user.getBio(), profileImagePath: user.getProfilePicPath()
          });
        } else {
          //sedn back 400 status error
          res.sendStatus(400);
        }
      } catch (e) {
        res.sendStatus(400);
      }
    })

    //Create a user -- aka a SIGNUP functionality
    //TODO: Add body parameters that aren't included (except salt) for the option. 
    this.router.post('/users', async (req: Request, res: Response) => {
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

    //TODO: Security checks
    this.router.patch("/users", this.auth.authenitcateJWT, async (req: Request, res: Response) => {
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

        res.sendStatus(200);

      } catch (e) {
        console.error("Profile edit post" + e);
        res.sendStatus(400);
      }

    })

    //TODO: Delete the user
    this.router.delete("/users/:userid", this.auth.authenitcateJWT, (req: Request, res: Response) => {
      try {

      } catch (e) {

      }
    })

    // register the routes
    app.use(this.router);
  }
}