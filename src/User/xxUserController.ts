// Could not get it to work this way and am not sure why. Explore further later.

// import IUserRepository from "./IRepository";
// import { Request, Response } from 'express';
// import IUser from "./IUser";
// import User from "../Models/User";

// export default class UserController {
//   //TODO: Inversify for the experience?
//   private userRepository: IUserRepository;

//   constructor(userRepo: IUserRepository) {
//     this.userRepository = userRepo;
//   }

//   //request object (ES6 syntax): {username, email, password}
//   public async signUp(req: Request, res: Response): Promise<void> {

//     console.log("In signup method");
//     if (!this.userRepository) {
//       console.log("Repo does not exist");
//     }
//     try {
//       //create the user with the information provided in the request
//       let user: IUser = new User();
//       user.setUsername(req.body.username);
//       user.setEmail(req.body.email);
//       user.setPassword(req.body.password);

//       //insert the user into the database 
//       let userInserted: Boolean = await this.userRepository.create(user);
//       console.log("User was inserted");
//       //TODO: Setup user authentication upon account creation

//       // if insertion successful return success
//       if (userInserted) {
//         res.sendStatus(201);
//       } else { // else return failure 
//         res.sendStatus(400);
//       }
//     } catch (e) {
//       console.error(e);
//     }

//   }
// }