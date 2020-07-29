import { Request, Response, NextFunction } from 'express';
import jwt, { JwtHeader, VerifyOptions, decode } from 'jsonwebtoken';
import fs, { access } from 'fs';
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
      //from body
      //let token: string | undefined = req.header('Authorization')?.replace('Bearer ', '');
      //from cookie
      // console.log("Cookies:");
      // console.log(req.cookies);
      let token: string | undefined = req.cookies["jwt"];

      // console.log("Parsed Cookie:");
      // console.log(token);

      if (!token) {
        return res.status(401); //not authenticated
      }

      //verify the passed in jsonwebtoken 
      let PUBLIC_KEY: Buffer = fs.readFileSync('C:\\Users\\Aaron\\Desktop\\Basic-Blog\\src\\Auth\\rsa.pem');

      //verify the token
      jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] }, function (err, payload) {
        //check for error in the decoding 
        if (err) {
          res.status(401).send("Error authenticating");
          return;
        }

        //check if payload is undefined --if not undefined the token is valid
        if (payload === undefined) {
          res.status(401).send("Error authenticating");
          return;
        }

        //console.log("Incoming cookies jwt payload: ");
        //console.log(payload);

        //make the payload keys accessible -- token interface is: {iat: string, sub: string, expires: string} as well as other keys
        let accessiblePayload: { [key: string]: any } = payload as { [key: string]: any };

        //get the subject from the payload
        let subject: string = accessiblePayload.sub;

        //verify the subject exists
        if (subject === undefined || subject === null || subject === '') {
          res.status(401).send("Error authenticating");
          return;
        }

        // attach subject information to res.locals to persist the information to endpoint
        res.locals.userId = subject;

        //continue flow to endpoint
        next();

      });
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
    });

    return jwtBearerToken;
  }

  //code that takes a jwt token and authenticates it then passes back the subject
  public setSubject(token: string | undefined, subject: { id: string }): void {
    //check if token exists
    if (!token) {
      //if no token return an empty string
      return;
    }

    //verify the passed in jsonwebtoken --TODO: Make async?
    let PUBLIC_KEY: Buffer = fs.readFileSync('C:\\Users\\Aaron\\Desktop\\Basic-Blog\\src\\Auth\\rsa.pem');

    //verify the token
    jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] }, function (err, payload) {
      console.log("Verify callback");
      //check for error in the decoding 
      if (err) {
        return;
      }

      //check if payload is undefined --if not undefined the token is valid
      if (payload === undefined) {
        return;
      }

      //make the payload keys accessible -- token interface is: {iat: string, sub: string, expires: string} as well as other keys
      let accessiblePayload: { [key: string]: any } = payload as { [key: string]: any };

      //set subject value 
      subject.id = accessiblePayload.sub;

      console.log("Subject should be set!");

      console.log(subject);

      //verify the subject exists
      if (subject === undefined || subject === null || subject.id === '') {
        return;
      }
    });

  }
}