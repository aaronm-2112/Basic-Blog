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

    //retrive a set of comments that can belong to a particular blog 
    //or be a search for any comment without regard to what blog it belongs to.
    //query parameters: blog, reply, replyto, orderby, likes, commentid
    //replyto is 0 when the requested comments are not replies
    //TODO: Add parameter to allow for going to the previous page.
    this.router.get('/comments', async (req: Request, res: Response) => {
      try {
        console.log("In comments route!");

        //retrieve the query parameters

        //blog parameter exists because comments have no alternative representation 
        //as hierarchical relationship such as blogs/:blogid/comments 
        //-- so could have less query paramaters if i added 
        //that and would have a more lean /comments exclusively for getting any comments
        let blogid: number = parseInt(req.query.blog as string);
        let reply: string = req.query.reply as string;
        let replyto: string = req.query.replyto as string;
        let orderby: string = req.query.orderby as string;
        let likes: string = req.query.likes as string;
        let commentid: string = req.query.commentid as string;

        //check if query parameters are valid
        if (blogid === undefined || isNaN(blogid) || reply === undefined || replyto === undefined || orderby === undefined || likes === undefined || commentid === undefined) {
          console.log("Yes");
          //no query parameters or bad query parameters in set return
          res.sendStatus(400); //client error in parameters
          return;
        }

        //create comments collection 
        let comments: IComment[];

        //check if the client is requesting comments for a particular blog 
        if (blogid > 0) {
          //fetch the comments from the repo with the query paramaters
          comments = await this.repo.findAll(blogid, (reply === "true") ?? false, parseInt(replyto), orderby, parseInt(likes), parseInt(commentid));
        } else {
          // client is requesting general comments -- mark blogid as 0
          comments = await this.repo.findAll(0, (reply === "true") ?? false, parseInt(replyto), orderby, parseInt(likes), parseInt(commentid));
        }

        console.log(comments);

        //return the comments 
        res.send(comments);
      } catch (e) {
        res.sendStatus(400);
        console.log(e);
      }
    });

    //retrieve a particular comment resource
    this.router.get('/comments/:commentid', async (req: Request, res: Response) => {
      try {

      } catch (e) {

      }
    });

    //create a new comment resource and returnt the comment id
    //body parameters: content, reply, replyto
    this.router.post('/comments', this.auth.authenitcateJWT, async (req: Request, res: Response) => {
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