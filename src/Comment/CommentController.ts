//Purpose: Dictate behaviour for the Comment model's views.

import IController from '../Controllers/IController';
import Auth from '../Auth/Auth';
import ICommentRepository from './Repositories/ICommentRepository';
import IComment from './IComment';
import Comment from './Comment';
import express, { Router, Request, Response } from "express";



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
    this.router.get('/comments', async (req: Request, res: Response) => {
      try {
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
        let commentid: number = parseInt(req.query.commentid as string)
        let flip: string = req.query.flip as string;


        //check if query parameters are valid
        if (blogid === undefined || isNaN(blogid) || reply === undefined || replyto === undefined || orderby === undefined || likes === undefined || commentid === undefined || flip === undefined, isNaN(commentid)) {
          //no query parameters or bad query parameters in set return
          res.sendStatus(400); //client error in parameters
          return;
        }

        //create comments collection 
        let comments: IComment[];

        //check if the client is requesting comments for a particular blog 
        if (blogid > 0) {
          //fetch the comments from the repo with the query paramaters
          comments = await this.repo.findAll(blogid, (reply === "true") ?? false, parseInt(replyto), orderby, parseInt(likes), commentid, flip);
        } else {
          // client is requesting general comments -- mark blogid as 0
          comments = await this.repo.findAll(0, (reply === "true") ?? false, parseInt(replyto), orderby, parseInt(likes), commentid, flip);
        }

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
        //extract commentid from the request parameter
        let cid: number = parseInt(req.params.commentid);

        //verify the commentid is valid
        if (cid <= 0 || isNaN(cid) || cid === undefined) {
          res.sendStatus(400);
          return;
        }

        //query for the comment in the repo using the commentid
        let comment: IComment = await this.repo.find(cid);

        //return the comment data back to the user
        res.send(comment);

      } catch (e) {
        res.sendStatus(400);
      }
    });

    //create a new comment resource and returnt the comment id
    //body parameters: content, reply, replyto, blogid
    this.router.post('/comments', this.auth.authenitcateJWT, async (req: Request, res: Response) => {
      try {
        //retrieve the body parameters
        let reply: boolean = req.body.reply as boolean;
        let replyto: number = parseInt(req.body.replyto);
        let content: string = req.body.content as string;
        let blogid: number = parseInt(req.body.blogid);

        //check if body parameters are valid
        if (blogid === undefined || isNaN(blogid) || reply === undefined || replyto === undefined || content == undefined || isNaN(replyto)) {
          //no query parameters or bad query parameters in set return
          res.sendStatus(400); //client error in parameters
          return;
        }

        //retrieve the username from the authentication process
        let username: string = res.locals.userId;

        //create a comment object using the body parameters
        let comment: IComment = new Comment();
        comment.username = username;
        comment.blogid = blogid;
        comment.likes = 0;   //0 likes because comment is being created
        comment.deleted = false; //comment is being created
        comment.reply = reply;
        comment.replyto = replyto;
        comment.content = content;


        //create the comment in the database
        let commentid: number = await this.repo.create(comment)

        //return the commentid
        res.send(commentid.toString());

      } catch (e) {
        console.log(e);
        res.sendStatus(400);
      }
    });

    //update a particular comment resource - used for adding likes to a comment, editing comment text, marking as deleted
    //body parameters: content, like, deleted, username
    //TODO: Add comment deletion functionality
    this.router.patch('comments/:commentid', this.auth.authenitcateJWT, async (req: Request, res: Response) => {
      try {
        //retrieve the username

        //check if the comment does not belongs to that user
        //---return authenticaiton error if so

        //retrieve the body parameters

        //retrieve the comment designated by the commentid from the repo

        //determine which comment properties have changed(define a comment method to do this)

        //update the comment with the comment repo

        //send back successful status code 200

      } catch (e) {

      }
    });

    //register the route
    app.use(this.router);
  }
}