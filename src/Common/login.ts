import { Request, Response } from 'express';
import * as express from 'express';
import Auth from '../Auth/Auth';
import IUserRepository from '../User/Repositories/IRepository';
import IUser from '../User/IUser';
import { compareUserPassword } from './salt';

export default async function login(app: express.Application, userRepository: IUserRepository) {
  //create an auth resource
  let auth: Auth = new Auth();

  app.post('/login', async (req: Request, res: Response) => {
    try {
      // Verify username and password passsed in
      let username: string = req.body.username;
      let password: string = req.body.password;

      //grab the user from the database 
      let user: IUser = await userRepository.find(username); //TODO: Make username a PK and unique

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
      const jwtBearerToken: string = auth.createJWT(user);

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
  });
}
