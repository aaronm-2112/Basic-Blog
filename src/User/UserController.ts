import IUserRepository from "./IRepository";
import IUser from './IUser';
import User from '../Models/User';
import Auth from '../Auth/Auth';
import { Request, Response, Router } from 'express';
import * as express from 'express';
import IController from "../Controllers/IController";
import { compareUserPassword } from '../Common/salt';


export default class UserController implements IController {

  //TODO: Inversify for the experience?
  private userRepository: IUserRepository;

  //Router
  private unguardedRouter: Router; // used for login
  private guardedRouter: Router;   // used for post login user activities 

  //Auth
  private auth: Auth;

  constructor(userRepo: IUserRepository) {
    // setup the user repository 
    this.userRepository = userRepo;
    // setup the unguarded router 
    this.unguardedRouter = express.Router();
    // setup the guarded router 
    this.guardedRouter = express.Router();
    this.auth = new Auth();
    this.guardedRouter.use(this.auth.authenitcateJWT);

  }

  registerRoutes(app: express.Application): void {

    //UNGUARDED ROUTES------------------------------------------------------------------

    //SIGNUP
    this.unguardedRouter.post('/signup', async (req: Request, res: Response) => {
      try {
        //create the user with the information provided in the request
        let user: IUser = new User();
        user.setUsername(req.body.username);
        user.setEmail(req.body.email);
        user.setPassword(req.body.password);

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
        res.sendStatus(400);
      }
    })

    //LOGIN
    this.unguardedRouter.post("/login", async (req: Request, res: Response) => {
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

        //create the bearer token for the user
        const jwtBearerToken: string = this.auth.createJWT(user);

        //send back the bearer token to the user
        res.status(200).send({ "idToken": jwtBearerToken, "expiresIn": "2 days" }) //TODO: Make configurable but is fine for now.
      } catch (e) {
        console.log(e);
        res.sendStatus(400);
      }
    })

    //GUARDED ROUTES------------------------------------------------------------------------------------------------------------------

    //TEST of Guarding -- remove when directory is setup
    // this.guardedRouter.get("/profile", async (req: Request, res: Response) => {
    //   res.sendStatus(200);
    // })
    // register the routes
    app.use(this.unguardedRouter);
    //app.use(this.guardedRouter);
  }
}