import { Request, Response, NextFunction } from 'express';
import jwt, { JwtHeader, VerifyOptions, decode } from 'jsonwebtoken';
import fs, { access } from 'fs';
import IUser from '../User/IUser';
import { NotAuthenticatedError } from '../Common/Errors/NotAuthenticatedError';

export default class Auth {

  //TODO: Fix public key not being available in class bug.
  // Acts as an authentication middleware that authenticates a user's JSON Webtoken
  // If no web token exists it throws a NotAuthenticatedError 
  public async authenitcateJWT(req: Request, res: Response, next: NextFunction) {
    // Get the JSONwebtoken 
    let token: string | undefined = req.cookies["jwt"];

    if (!token) {
      throw new NotAuthenticatedError()
    }

    //verify the passed in jsonwebtoken 
    const PUBLIC_KEY: Buffer = fs.readFileSync('C:\\Users\\Aaron\\Desktop\\Basic-Blog\\src\\Auth\\rsa.pem');

    //verify the token
    jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] }, function (err, payload) {
      //check for error in the decoding 
      if (err) {
        throw new NotAuthenticatedError()
      }

      //check if payload is undefined --if not undefined the token is valid
      if (payload === undefined) {
        throw new NotAuthenticatedError()
      }

      //make the payload keys accessible -- token interface is: {iat: string, sub: string, expires: string} as well as other keys
      let accessiblePayload: { [key: string]: any } = payload as { [key: string]: any };

      //get the subject from the payload
      let subject: string = accessiblePayload.sub;

      //verify the subject exists
      if (subject === undefined || subject === null || subject === '') {
        throw new NotAuthenticatedError()
      }

      // attach subject information to res.locals to persist the information to endpoint
      res.locals.userId = subject;

      //continue flow to endpoint
      next();

    });
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