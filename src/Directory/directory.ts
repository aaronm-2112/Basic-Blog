//Purpose: Define the filesystem for the application. 
import * as express from 'express';
import { Request, Response, Router } from 'express';
import Auth from '../Auth/Auth';

export default class Directory {

  //routes that do not need to be authguarded
  private unguardedRouter: Router = express.Router();
  //routes that need to be authguarded
  private guardedRouter: Router = express.Router();
  //Auth
  private auth: Auth;

  //setup jwt authentication on the guarded router
  constructor() {
    this.auth = new Auth();
    this.guardedRouter.use(this.auth.authenitcateJWT);
  }

  //all the paths in the filesystem that can be reached through normal user navigation
  private paths: { root: string, signup: string, login: '/login', search: string, profile: string, homepage: string } = { root: '/', signup: '/signup', login: '/login', search: '/search', profile: '/profile/:userId', homepage: '/homepage' };

  //direct express middleware to render the paths using handlebars
  registerRoutes(app: express.Application) {

    //render root path
    this.unguardedRouter.get(`${this.paths.root}`, (req: Request, res: Response) => {
      res.redirect('http://localhost:3000/homepage');
    })

    this.guardedRouter.get(`${this.paths.homepage}`, (req: Request, res: Response) => {
      res.render('Homepage');
    })

    //render search path
    this.unguardedRouter.get(`${this.paths.search}`, (req: Request, res: Response) => {
      res.render('Search', this.paths)
    })

    this.unguardedRouter.get(`${this.paths.signup}`, (req: Request, res: Response) => {
      res.render('Signup');
    })

    this.unguardedRouter.get(`${this.paths.login}`, (req: Request, res: Response) => {
      res.render('Login');
    })

    // //render profile path
    // this.guardedRouter.get(`${this.paths.profile}`, (req: Request, res: Response) => {
    //   res.render('Profile', this.paths)
    // })

    //render wildcard path
    // this.unguardedRouter.get('*', (req: Request, res: Response) => {
    //   res.send("Wow nothing there").status(200);
    // });

    //Tell express to use these routes
    app.use(this.unguardedRouter);
    app.use(this.guardedRouter);
  }
}