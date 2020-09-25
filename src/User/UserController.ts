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

    /*
    Send back all user information needed for the profile and profile edit views.
    Query parameters: editPage = true | false -- marking true returns the editable portion of the user resource 
                                                 marking false or leaving undefined returns the whole user resource
    Accept: 'text/html || 'application/json'
        Question: Is this a good/acceptable use of query parameters? 
        Answer: It may be flawed but my approach is that this route provides a user resource. 
                The query parameters only defines the way in which to view the resource
                (either in a profile page form or a edit page form) so this is not an unacceptable use of them.
    */
    this.router.get('/users/:userid', this.auth.authenitcateJWT, async (req: Request, res: Response) => {
      try {
        //ensure the user has at least one of the correct Accept header values
        if (req.accepts(['text/html', 'application/json']) === false) {
          res.sendStatus(406);
          return;
        }

        //extract the username from the route parameter
        let usernamePassedIn: string = req.params.userid;

        //check if route parameter is undefined
        if (usernamePassedIn === undefined) {
          //return error status code if so
          res.sendStatus(400);
          return;
        }

        //decode the username from the route parameter passed in 
        usernamePassedIn = decodeURIComponent(usernamePassedIn);

        //find the user with the user repository using the route parameter
        let user: IUser = await this.userRepository.find(usernamePassedIn);

        console.log(user);

        //extract the username of the client making the request from the auth service
        let verifiedUsername: string = res.locals.userId;

        //check if the username of the client making the request matches that of the user found with the route parameter
        if (!user.usernameMatches(verifiedUsername)) {
          //send back frobidden status code if not
          res.sendStatus(403);
          return;
        }

        //Get the user's first 10 blogs
        let blogs: IBlog[] = await this.blogRepository.findAll(searchParameters.Username, (user.username as string), "0", ">");

        //store front end blog information
        let blogDetails: Array<{ title: string, editPath: string, viewPath: string }> = new Array<{ title: string, editPath: string, viewPath: string }>();

        //Extract the title and blogID and place them into a structure with the paths to edit and view blogs
        blogs.forEach(blog => {
          blogDetails.push({ title: blog.title, editPath: `http://localhost:3000/blogs/${blog.blogid}?edit=true`, viewPath: `http://localhost:3000/blogs/${blog.blogid}?edit=false` })
        });

        //extract the query parameter
        let edit: string = req.query.editPage as string;

        //check if edit was left undefined or marked false
        if (edit === undefined || edit === "false") {
          //check if client wants an html representation of the user resource
          if (req.accepts('text/html') === "text/html") {
            //send back the user profile view in html
            res.render('Profile', {
              userName: user.getUsername(), firstName: user.getFirstname(),
              lastName: user.getLastname(), bio: user.getBio(),
              blogDetails: blogDetails,
              profileImagePath: user.getProfilePicPath()
            });
          } else {
            //default to a JSON representation of the user profile information
            res.status(200).send({
              userName: user.getUsername(), firstName: user.getFirstname(),
              lastName: user.getLastname(), bio: user.getBio(),
              blogDetails: blogDetails,
              profileImagePath: user.getProfilePicPath()
            });
          }
        } else {
          //check if client wants an html representation of the editable portion of the user reource
          if (req.accepts('text/html') === "text/html") {
            //send back the user edit view
            res.render('ProfileEdit', {
              userName: user.getUsername(), firstName: user.getFirstname(),
              lastName: user.getLastname(), bio: user.getBio(), profileImagePath: user.getProfilePicPath()
            });
          } else {
            //send a JSON representation
            res.status(200).send({
              userName: user.getUsername(), firstName: user.getFirstname(),
              lastName: user.getLastname(), bio: user.getBio(),
              profileImagePath: user.getProfilePicPath()
            });
          }
        }

      } catch (e) {
        res.sendStatus(400);
      }
    })

    //Create a user -- aka a SIGNUP functionality
    //Body parameters: username, email, password, firstname, lastname, bio
    //Accept: 'application/json'
    this.router.post('/users', async (req: Request, res: Response) => {
      try {
        //check if the client has a valide Accept header value
        if (req.accepts('application/json') === false) {
          //if not return status code 406
          res.sendStatus(406);
          return;
        }

        //extract the essential user information from the body of the request
        let password: string = req.body.password as string;
        let email: string = req.body.email as string;
        let username: string = req.body.username as string;

        //verify that the essential information is provided
        if (username === undefined || email === undefined || password === undefined || username === "" || email === "" || password === "") {
          //if not return 400 error
          res.sendStatus(400);
          return;
        }

        //create a user
        let user: IUser = new User();

        //fill out the user's properties with the essential body values
        user.setPassword(password);
        user.setEmail(email);
        user.setUsername(username);

        //extract the remaining user infromation from the body of the request
        let firstname: string = req.body.firstname as string;
        let lastname: string = req.body.lastname as string;
        let bio: string = req.body.bio as string;


        //fill out the user's remaining properties with any valid body properties remaining
        if (firstname !== undefined) {
          user.setFirstname(firstname);
        }

        if (lastname !== undefined) {
          user.setLastname(lastname);
        }

        if (bio !== undefined) {
          user.setBio(bio);
        }


        //insert the user into the database 
        let userid: number = await this.userRepository.create(user);

        //return the userid and status code
        res.status(201).location(`http://localhost:3000/users/${userid}`).send({ userid });
      }
      catch (e) {
        console.log(e);
        res.sendStatus(400);
      }
    })


    //TODO: Add userid to patch url for consistency & security checks
    //Body Parameters: firstName, lastName, bio, profilePicPath
    //Accept: 'application/json'
    this.router.patch("/users", this.auth.authenitcateJWT, async (req: Request, res: Response) => {
      try {
        //check if the client has a valide Accept header value
        if (req.accepts('application/json') === false) {
          res.sendStatus(406);
          return;
        }

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

        if (req.body.firstName !== undefined) {
          user.setFirstname(firstName);
        }

        //blog title
        if (req.body.lastName !== undefined) {
          user.setLastname(lastName);
        }

        //blog's path to titleimage
        if (req.body.bio !== undefined) {
          user.setBio(bio);
        }

        //blog's username value -- TODO: Determine if this is necessary here
        if (req.body.profilePicturePath !== undefined) {
          user.setProfilePicPath(profilePicPath);
        }

        //update the user information in the database
        user = await this.userRepository.update(user);

        //send a 200 status code and the updated user resource
        res.status(200).send(user);
      } catch (e) {
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