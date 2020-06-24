//Purpose: Define the filesystem for the application. 
import * as express from 'express';
import { Request, Response, Router } from 'express';
import Auth from '../Auth/Auth';

export default class Directory {

  //common directory routes
  private router: Router = express.Router();
  //Auth
  private auth: Auth;

  //setup jwt authentication
  constructor() {
    this.auth = new Auth();
  }

  //all the paths in the filesystem that can be reached through normal user navigation
  private paths: { root: string, signup: string, login: '/login', search: string, profile: string, homepage: string } = { root: '/', signup: '/signup', login: '/login', search: '/search', profile: '/profile/:userId', homepage: '/homepage' };

  //direct express middleware to render the paths using handlebars
  registerRoutes(app: express.Application) {

    // //render root path -- for now make unguarded version of homepage
    // this.unguardedRouter.get(`${this.paths.root}`, (req: Request, res: Response) => {
    //   res.redirect('http://localhost:3000/homepage');
    // })

    this.router.get(`${this.paths.homepage}`, this.auth.authenitcateJWT, (req: Request, res: Response) => {
      console.log("In homepage route");
      res.render('Homepage');
    })

    //render search path
    this.router.get(`${this.paths.search}`, (req: Request, res: Response) => {
      res.render('Search', this.paths)
    })

    this.router.get(`${this.paths.signup}`, (req: Request, res: Response) => {
      res.render('Signup');
    })

    this.router.get(`${this.paths.login}`, (req: Request, res: Response) => {
      res.render('Login');
    })

    //render wildcard path -- needs to be after all routes defined in other paths too
    // this.router.get('*', (req: Request, res: Response) => {
    //   res.send("Wow nothing there").status(200);
    // });

    //Use the directory routes at root level 
    app.use('/', this.router);
  }
}