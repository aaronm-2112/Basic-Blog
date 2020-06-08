//Purpose: Define the filesystem for the application. 
import * as express from 'express';
import { Request, Response, Router } from 'express';

export default class Directory {

  //routes that do not need to be authguarded
  private unguardedRouter: Router = express.Router();

  //all the paths in the filesystem that can be reached through normal user navigation
  private paths: { root: string, search: string, profile: string } = { root: '/', search: '/search', profile: '/profile' };

  //direct express middleware to render the paths using handlebars
  registerRoutes(app: express.Application) {

    //render root path
    this.unguardedRouter.get(`${this.paths.root}`, (req: Request, res: Response) => {
      res.render('Homepage', this.paths)
    })

    //render search path
    this.unguardedRouter.get(`${this.paths.search}`, (req: Request, res: Response) => {
      res.render('Search', this.paths)
    })

    //render profile path
    this.unguardedRouter.get(`${this.paths.profile}`, (req: Request, res: Response) => {
      res.render('Profile', this.paths)
    })

    //render wildcard path
    this.unguardedRouter.get('*', (req: Request, res: Response) => {
      res.send("Wow nothing there").status(200);
    });

    //Tell express to use these routes
    app.use(this.unguardedRouter);
  }
}