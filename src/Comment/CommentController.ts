//Purpose: Dictate behaviour for the Comment model's views.

import IController from '../Controllers/IController';
import Auth from '../Auth/Auth';
import ICommentRepository from './Repositories/ICommentRepository';
import IComment from './IComment';
import express, { Router, Request, Response } from "express";
import { createCipher } from 'crypto';



export default class CommentControler implements IController {

  private repo: ICommentRepository;
  private router: Router;
  private auth: Auth;

  constructor(repo: ICommentRepository) {
    this.repo = repo;
    this.router = express.Router();
    this.auth = new Auth();
  }

  registerRoutes(app: express.Application): void {

    //retrive a set of comments 
    //query parameters: reply, replyto, orderby, likes, commentid
    //replyto is 0 when the requested comments are not replies
    //TODO: Add parameter to allow for going to the previous page.
    this.router.get('/comments', async (req: Request, res: Response) => {
      try {

        //retrieve the query parameters
        let reply: string = req.query.reply as string;
        let replyto: string = req.query.replyto as string;
        let orderby: string = req.query.orderby as string;
        let likes: string = req.query.likes as string;
        let commentid: string = req.query.commentid as string;

        //check if query parameters are valid
        if (reply === undefined || replyto === undefined || orderby === undefined || likes === undefined || commentid === undefined) {
          //no query parameters or bad query parameters in set return
          res.sendStatus(400); //client error in parameters
          return;
        }

        //fetch the comments from the repo with the query paramaters
        let comments: IComment[] = await this.repo.findAll((reply === "true") ?? false, parseInt(replyto), orderby, parseInt(likes), parseInt(commentid)); //test use of nullish coalescing

        console.log(comments);

        //return the comments 
        res.send(comments);
      } catch (e) {
        res.sendStatus(400);
      }
    });

    //retrieve a particular comment resource
    this.router.get('/comments/:commentid', async (req: Request, res: Response) => {
      try {

      } catch (e) {

      }
    });

    //create a new comment resource and returnt the comment id
    //body parameters: content, username, reply, replyto
    this.router.post('/comments', async (req: Request, res: Response) => {
      try {

      } catch (e) {

      }
    });

    //update a particular comment resource
    //body parameters: content, deleted, etc more detail when i get to it
    this.router.patch('comments/:commentid', async (req: Request, res: Response) => {
      try {

      } catch (e) {

      }
    });

    //register the route
    app.use(this.router);
  }
}