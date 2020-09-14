import IBlogRepository from "./Repositories/IBlogRepository";
import IController from '../Controllers/IController';
import express, { Router, Request, Response } from "express";
import Auth from "../Auth/Auth";
import IBlog from "./IBlog";
import Blog from "./Blog";
import { searchParameters } from "./BlogSearchCriteria";
import path from 'path';


export default class BlogController implements IController {
  private repo: IBlogRepository;
  private router: Router;
  private auth: Auth;

  constructor(repo: IBlogRepository) {
    this.repo = repo;
    this.router = express.Router();
    this.auth = new Auth(); //TODO: Make a singleton?
  }

  registerRoutes(app: express.Application): void {

    //Done: [TODO: Make route blogs and keeep the same]
    //TODO: Make /blogs/:blogID and replace edit with a query parameter
    //Done: [ TODO: Move create blog into the directory ]

    //returns blog creation view
    this.router.get('/blogs', this.auth.authenitcateJWT, async (req: Request, res: Response) => {
      try {
        //grab the query string from the parameters
        let searchBy: string = req.query.param as string;
        let value: string = req.query.value as string;
        let blogid: string = req.query.key as string;
        let keyCondition: string = req.query.keyCondition as string; //should be > or < 

        //check if the query string exists
        if (value !== "" && value !== undefined) {
          //create the blog collection
          let blogs: IBlog[]

          //check if parameter is valid
          switch (searchBy) {
            case searchParameters.Username:
              //search the blog repo using the query parameter
              blogs = await this.repo.findAll(searchParameters.Username, value, blogid, keyCondition);
              break;
            case searchParameters.Title:
              //search the blog repo using the query parameter
              blogs = await this.repo.findAll(searchParameters.Title, value, blogid, keyCondition);
              break;
            default:
              //invalid search parameter -- result not found
              res.sendStatus(404);
              return;
          }

          //return the results to the user 
          res.send(blogs);
          return;
        }
      } catch (e) {
        res.sendStatus(400);
        console.log(e);
        throw new Error(e);
      }
    });

    //return a specific blog for viewing/editing or a list of blogs based off a query term
    this.router.get('/blogs/:blogID', async (req: Request, res: Response) => {
      try {
        //retrieve the blogID from the request parameter
        let blogID: string = req.params.blogID;

        //retrieve the blog object with it's ID
        let blog: IBlog = await this.repo.find(searchParameters.BlogID, blogID);

        //set path to the image from the Views directory [views are in /Views] using absolute paths
        //TODO: Use env to get absolute path not hardcoded string
        let imagePath: string = "http://localhost:3000/" + path.normalize(blog.titleimagepath);

        //get the edit request parameter
        let edit: string = req.query.edit as string;

        //check the value of edit
        if (edit !== undefined && edit !== "false") {

          //get the userID from the cookie
          let userID: { id: string } = { id: "" };
          this.auth.setSubject(req.cookies["jwt"], userID);

          //check if a userID was extracted from the incoming JWT
          if (!userID.id.length) {
            //if not return because there is no way to verify if the incoming user owns the blog they want to edit
            res.sendStatus(400);
            return;
          }

          //check if the incoming userID matches the username of the blog's owner -- only owners can edit their blog
          if (userID.id === blog.username) {
            //render the edit blog template
            res.render('EditBlog', {
              titleImagePath: imagePath,
              title: blog.title,
              username: blog.username,
              content: blog.content
            });
            return;
          } else {
            //user does not have access
            res.sendStatus(400);
            return;
          }
        } else {
          //render the viewable blog template with the blog's properties
          res.render('Blog', {
            titleImagePath: imagePath,
            title: blog.title,
            username: blog.username,
            content: blog.content
          });
        }
      } catch (e) {
        res.sendStatus(400);
        console.log(e);
        throw new Error(e);
      }
    });

    //create a blog resource --return blogID 
    //A blog resource contains a path to the blog's title image if one was uploaded.
    this.router.post('/blogs', this.auth.authenitcateJWT, async (req: Request, res: Response) => {
      try {
        //create a blog resource
        let blog: IBlog = new Blog();

        //set the username -- foreign key for the Blog entity that connects it to the User entity
        blog.username = res.locals.userId;

        //set the content of the blog
        blog.content = req.body.content;

        //set the title of the blog
        blog.title = req.body.title;

        //create the blog in the database 
        let blogID: number = await this.repo.create(blog);

        //return the blog id to the user
        res.send(blogID.toString());
      } catch (e) {
        res.sendStatus(400);
        throw new Error(e);
      }

    });

    //patch a blog entity with content, titleImagePath, username, or the title as properties that can be updated
    this.router.patch('/blogs/:blogID', this.auth.authenitcateJWT, async (req: Request, res: Response) => {
      try {
        //get the userID
        let userID: string = res.locals.userId;

        //get the blog via the blogID
        let blog: IBlog = await this.repo.find(searchParameters.BlogID, req.params.blogID);

        //TODO: Make blog method to do this b/c this is not/shouldn't be controller logic 
        //check if the incoming userID isn't the same as the blog identified with the incoming blogID
        if (userID !== blog.username) {
          //the user does not have authorization to edit this blog
          res.sendStatus(400);
          return;
        }

        //store incoming request parameters 
        let editBlog: IBlog = new Blog();

        //TODO: Make blog method to do this b/c this is not/shouldn't be controller logic 
        //determine which blog properties are being patched based off request body parameters
        if (req.body.content !== null && req.body.content !== undefined) {
          editBlog.content = req.body.content;
        }

        //blog title
        if (req.body.title !== null && req.body.title !== undefined) {
          editBlog.title = req.body.title;
        }

        //blog's path to titleimage
        if (req.body.titleImagePath !== null && req.body.titleImagePath !== undefined) {
          editBlog.titleimagepath = req.body.titleImagePath;
        }

        //blog's username value -- TODO: Determine if this is necessary here
        if (req.body.username !== null && req.body.username !== undefined) {
          editBlog.username = req.body.username;
        }

        //set blog object's blogID using the incoming request parameter
        editBlog.blogid = parseInt(req.params.blogID);

        //update the corresponding blog -- properties not being patched stay as Blog object constructor defaults
        await this.repo.update(editBlog);

        //send no content success
        res.sendStatus(204);
      } catch (e) {
        console.error(e);
        res.sendStatus(400);
      }

    });

    //register router with the app
    app.use(this.router);
  }


}