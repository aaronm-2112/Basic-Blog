//Purpose: Define the filesystem for the application. 
import * as express from 'express';
import { Request, Response, Router } from 'express';
import Auth from '../Auth/Auth';

//TODO: Wildcard pathing setup
export default class Directory {

  private router: Router = express.Router();
  private auth: Auth;

  //setup auth and inject repositories
  constructor() {
    this.auth = new Auth();
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

        //check if any userid was extracted from the jwt
        if (userID.id.length) {
          //if so render homepage with a link to the user profile
          res.render('Homepage', {
            links: [["home", this.paths.root], ["search", this.paths.search], ["profile", this.paths.profile + `${userID.id}?profile=true`]]
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