import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import IUser from '../User/IUser';

export default class Auth {

  //private PUBLIC_KEY: string;

  constructor() {
    //this.PUBLIC_KEY = fs.readFileSync('C:\\Users\\Aaron\\Desktop\\Typescript-Starter\\src\\Auth\\jwtRS256.key.pub', "utf8")
    //console.log(this.PUBLIC_KEY);
  }


  //TODO: Fix public key not being available in class bug. 
  public async authenitcateJWT(req: Request, res: Response, next: NextFunction) {
    try {
      // Get the JSONwebtoken 
      let token: string | undefined = req.header('Authorization')?.replace('Bearer ', '');

      //verify the passed in jsonwebtoken 
      let PUBLIC_KEY: Buffer = fs.readFileSync('C:\\Users\\Aaron\\Desktop\\Basic-Blog\\src\\Auth\\rsa.pem');
      let payload: string | object = jwt.verify((token as string), PUBLIC_KEY, { algorithms: ["RS256"] })

      //check if authenticated 
      payload ? next() : res.status(400).send("Failure authenticating")
    } catch (e) {
      console.log("Error: " + e)
      res.status(401).send("Error authenticating")
    }

  }

  public createJWT(user: IUser): string {
    //create a jwt using the private key and the user information
    const PRIVATE_KEY: Buffer = fs.readFileSync('C:\\Users\\Aaron\\Desktop\\Basic-Blog\\src\\Auth\\rsa.key') //TODO: Use env npm package
    const jwtBearerToken: string = jwt.sign({}, PRIVATE_KEY, {
      algorithm: 'RS256',
      expiresIn: "2 days",
      subject: `${user.getUsername()}` //TODO: Do not use username in the jwt payload -- use user id 
    })

    return jwtBearerToken;
  }


}