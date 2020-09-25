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

    //returns all blogs defined by the client's query parameters
    //Query parameters: param = username || title, value, blogid, keyCondition
    //Accept header: application/json
    //Content Type header: application/json 
    this.router.get('/blogs', async (req: Request, res: Response) => {
      try {
        if (req.accepts('application/json') === false) {
          res.sendStatus(406);
          return;
        }

        //grab the query string from the parameters
        let searchBy: string = req.query.param as string;
        let searchByValue: string = req.query.value as string;
        let blogid: string = req.query.key as string;
        let keyCondition: string = req.query.keyCondition as string; //should be > or < 

        //check if the query string exists
        if (searchByValue !== "" && searchByValue !== undefined) {
          //decode the searchbyvalue passed in
          searchByValue = decodeURIComponent(searchByValue);
          console.log(searchByValue);

          //create the blog collection
          let blogs: IBlog[]

          //check if parameter is valid
          switch (searchBy) {
            case searchParameters.Username:
              //search the blog repo using the query parameter
              blogs = await this.repo.findAll(searchParameters.Username, searchByValue, blogid, keyCondition);
              break;
            case searchParameters.Title:
              //search the blog repo using the query parameter
              blogs = await this.repo.findAll(searchParameters.Title, searchByValue, blogid, keyCondition);
              break;
            default:
              //invalid search parameter -- result not found
              res.sendStatus(400);
              return;
          }

          //return the results to the user 
          res.status(200).send(blogs);
        }
      } catch (e) {
        res.sendStatus(400);
      }
    });

    //return a specific blog for viewing/editing or a list of blogs based off a query term
    //Query parameters: editPage - view the blog resorce in an editable html representation(not applicable to application/json)
    //Accept options: text/html or application/json
    //Response Content Type: text/html or application/json
    this.router.get('/blogs/:blogID', async (req: Request, res: Response) => {
      try {
        //retrieve the blogID from the request parameter
        let blogID: string = req.params.blogID;

        //retrieve the blog object with it's ID
        let blog: IBlog = await this.repo.find(searchParameters.BlogID, blogID);

        //set path to the image from the Views directory [views are in /Views] using absolute paths
        //TODO: Use env to get absolute path not hardcoded string
        let imagePath: string = "http://localhost:3000/" + path.normalize(blog.titleimagepath);

        //get the edit query parameter
        let edit: string = req.query.editPage as string;

        //check if user wants to view the blog in a json representation
        if (req.accepts('application/json') === 'application/json') {
          //if so send json representation of their 
          res.status(200).send({
            titleImagePath: imagePath,
            title: blog.title,
            username: blog.username,
            content: blog.content
          });
          return;
        }

        //check if client does not wants text/html
        if (req.accepts('text/html') === false) {
          //if so send not acceptable status code
          res.sendStatus(406);
          return;
        }

        //check the value of edit
        if (edit !== undefined && edit !== "false") {

          //get the userID from the cookie
          let userID: { id: string } = { id: "" };
          this.auth.setSubject(req.cookies["jwt"], userID);

          //check if a userID was extracted from the incoming JWT
          if (!userID.id.length) {
            //if not return because there is no way to verify if the incoming user owns the blog they want to edit
            res.sendStatus(403);
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
            res.sendStatus(403);
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
    //Body parameters: title, content
    //Accept: application/json
    //Response Content Type: Application/json
    this.router.post('/blogs', this.auth.authenitcateJWT, async (req: Request, res: Response) => {
      try {
        //check if the request's Accept header matches the response Content Type header
        if (req.accepts("application/json") === false) {
          res.sendStatus(406);
          return;
        }

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
        res.status(201).location(`http://localhost:3000/blogs/${blogID}`).send({ blogID });
      } catch (e) {
        res.sendStatus(400);
        throw new Error(e);
      }

    });

    //patch a blog resource
    //Body Parameters: content, titleImagePath, title
    //Accept: application/json
    //Response Content Type: application/json
    this.router.patch('/blogs/:blogID', this.auth.authenitcateJWT, async (req: Request, res: Response) => {
      try {
        //ensure request accept header matches the response Content Type header
        if (req.accepts('application/json') === false) {
          res.sendStatus(406);
          return;
        }

        //get the userID
        let userID: string = res.locals.userId;

        //extract the request parameter
        let blogid: string = req.params.blogID;

        //extract the body parameters
        let title: string = req.body.title as string;
        let content: string = req.body.content as string;
        let titleimagepath: string = req.body.titleImagePath as string;

        //get the blog via the blogID
        let blog: IBlog = await this.repo.find(searchParameters.BlogID, blogid);

        //check if the user was not the one that created the blog
        if (!blog.creator(userID)) {
          //the user does not have authorization to edit this blog
          res.sendStatus(403);
          return;
        }

        //store incoming request parameters 
        let editBlog: IBlog = new Blog();

        //determine which blog properties are being patched based off request body parameters
        if (content !== undefined) {
          editBlog.setContent(content);
        }

        //blog title
        if (title !== undefined) {
          editBlog.setTitle(title);
        }

        //blog's path to titleimage
        if (titleimagepath !== undefined) {
          editBlog.setTitleimagepath(titleimagepath);
        }

        //set the blogid to a number
        let blogidNumber: number = parseInt(blogid);

        //check if blogidNumber is NaN
        if (isNaN(blogidNumber)) {
          res.sendStatus(400);
          return;
        }

        //set blog object's blogID using the incoming request parameter
        editBlog.setBlogid(blogidNumber);

        //update the corresponding blog -- properties not being patched stay as Blog object constructor defaults
        blog = await this.repo.update(editBlog);

        //send no content success
        res.status(200).send(blog);
      } catch (e) {
        res.sendStatus(400);
      }
    });

    //register router with the app
    app.use(this.router);
  }


}