//Purpose: Define the filesystem for the application. 
import * as express from 'express';
import { Request, Response, Router } from 'express';
import Auth from '../Auth/Auth';
import IUserRepository from '../User/Repositories/IRepository';
import IBlogRepository from '../Blog/Repositories/IBlogRepository';
import IUser from '../User/IUser';
import IBlog from '../Blog/IBlog';
import { searchParameters } from "../Blog/BlogSearchCriteria";

export default class Directory {

  private router: Router = express.Router();
  private auth: Auth;
  private userRepository: IUserRepository;
  private blogRepository: IBlogRepository;


  //setup auth and inject repositories
  constructor(userRepository: IUserRepository, blogRepository: IBlogRepository) {
    this.auth = new Auth();
    this.userRepository = userRepository;
    this.blogRepository = blogRepository;
  }

  //all the paths in the filesystem that can be reached through normal user navigation
  private paths: { root: string, search: string, profile: string, profileEdit: string, blog: string } = { root: '/', search: '/search', profile: '/users/', profileEdit: '/profile/edit', blog: '/blog' };

  //direct express middleware to render the paths using handlebars
  registerRoutes(app: express.Application) {

    //render root path -- for now make unguarded version of homepage
    //TODO: MAke a special authentication method that is called as middleware that doesn't fail but rather passes in info that user is not authenticated. This is to avoid the synchronous setSubject call on the homepage.
    this.router.get(`${this.paths.root}`, async (req: Request, res: Response) => {
      try {
        //get the userID from the cookie
        let userID: { id: string } = { id: "" };

        //extract the userid from the jwt 
        this.auth.setSubject(req.cookies["jwt"], userID);

        console.log(userID);

        //check if any userid was extracted from the jwt
        if (userID.id.length) {
          //find the user
          let user: IUser = await this.userRepository.find(userID.id);

          //if so render homepage with a link to the user profile
          res.render('Homepage', {
            links: [["home", this.paths.root], ["search", this.paths.search], ["profile", this.paths.profile + `${user.getUserID()}`]]
          });
        } else {
          //render homepage without a link to the user profile
          res.render('Homepage', {
            links: [["home", this.paths.root], ["search", this.paths.search]]
          });
        }
      } catch (e) {

      }
    })


    //render search path
    this.router.get(`${this.paths.search}`, (req: Request, res: Response) => {
      //get the userID from the cookie
      let userID: { id: string } = { id: "" };

      //extract the userid from the jwt 
      this.auth.setSubject(req.cookies["jwt"], userID);

      //determine if the user is signed in
      if (userID.id.length) {
        //send entire navigatin options
        res.render('Search', { links: [["home", this.paths.root], ["search", this.paths.search], ["profile", this.paths.profile]] });
      } else {
        //no profile option
        res.render('Search', { links: [["home", this.paths.root], ["search", this.paths.search]] });
      }
    })

    //render profile page
    this.router.get(`${this.paths.profile}`, this.auth.authenitcateJWT, async (req: Request, res: Response) => {
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
        let blogs: IBlog[] = await this.blogRepository.findAll(searchParameters.Username, (user.username as string), blogid, keyCondition);

        //store front end blog information
        let blogDetails: Array<{ title: string, editPath: string, viewPath: string }> = new Array<{ title: string, editPath: string, viewPath: string }>();

        //Extract the title and blogID and place them into a structure with the paths to edit and view blogs
        blogs.forEach(blog => {
          blogDetails.push({ title: blog.title, editPath: `http://localhost:3000/blogs/${blog.blogid}?edit=true`, viewPath: `http://localhost:3000/blogs/${blog.blogid}?edit=false` })
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

    //render profile editing page
    this.router.get(`${this.paths.profileEdit}`, this.auth.authenitcateJWT, async (req: Request, res: Response) => {
      try {
        //grab username out of the local vars
        let username: string = res.locals.userId //TODO: Add error checking

        //Get the user information 
        let user: IUser = await this.userRepository.find(username);

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

    //render the blog creation page
    this.router.get('/blog', this.auth.authenitcateJWT, (req: Request, res: Response) => {
      res.render('CreateBlog');
    })

    //render wildcard path -- needs to be after all routes defined in other paths too
    // this.router.get('*', (req: Request, res: Response) => {
    //   res.send("Wow nothing there").status(200);
    // });

    //Use the directory routes at root level 
    app.use('/', this.router);
  }
}