import IBlogRepository from "./IBlogRepository";
import IController from '../Controllers/IController';
import express, { Router, Request, Response } from "express";
import Auth from "../Auth/Auth";
import multer from 'multer';
import IBlog from "./IBlog";
import Blog from "./Blog";
import { searchParameters } from "./BlogSearchCriteria";
import path from 'path';




export default class BlogController implements IController {
  private repo: IBlogRepository;
  private router: Router;
  private auth: Auth;
  private upload = multer({ dest: 'uploads/' });

  constructor(repo: IBlogRepository) {
    this.repo = repo;
    this.router = express.Router();
    this.auth = new Auth(); //TODO: Make a singleton?
  }

  registerRoutes(app: express.Application): void {

    //returns blog creation view
    this.router.get('/blog', this.auth.authenitcateJWT, async (req: Request, res: Response) => {
      try {
        res.render('CreateBlog');
      } catch (e) {
        res.sendStatus(400);
        console.log(e);
        throw new Error(e);
      }
    });

    //return a specific blog for viewing
    this.router.get('/blog/:blogID', async (req: Request, res: Response) => {
      try {
        //retrieve the blogID from the request parameter
        let blogID: string = req.params.blogID;

        //retrieve the blog object with it's ID
        let blog: IBlog = await this.repo.find(searchParameters.BlogID, blogID);

        //set path to the image from the Views directory [views are in /Views] using absolute paths
        //TODO: Use env to get absolute path not hardcoded string
        let imagePath: string = "http://localhost:3000/" + path.normalize(blog.titleImagePath);

        //change \ to / in blog's path to the title image
        imagePath = imagePath.replace(/\\/g, "/");

        //render the blog template with the blog's properties
        res.render('Blog', {
          titleImagePath: imagePath,
          title: blog.title,
          username: blog.username,
          content: blog.content
        });

      } catch (e) {
        res.sendStatus(400);
        console.log(e);
        throw new Error(e);
      }
    });

    //Receive blog banner image place it in public images and create a blog resource
    //TODO: Ensure an image is sent and not other kinds of media[security thing]
    //Method One: Part of method one. To post image and create blog resource. Then patch resource with text content.
    //            Decided to refactor this. 
    // this.router.post('/blog', this.auth.authenitcateJWT, this.upload.single("image"), async (req: Request, res: Response) => {
    //   try {
    //     //check if image is uploaded 
    //     if (req.file) {
    //       console.log(req.file);
    //       //if image is uploaded create a new blog 
    //       let blog: IBlog = new Blog();

    //       //set titleImagePath to the uploaded image's path attribute
    //       blog.titleImagePath = req.file.path;

    //       //set the username -- foreign key for the blog
    //       blog.username = res.locals.userId;

    //       //add the blog to the database 
    //       await this.repo.create(blog);

    //       //find the blog's ID and send back to user 
    //       console.log("Creation successful");
    //       blog = await this.repo.find(searchParameters.TitleImagePath, req.file.path);

    //       //get the blog id
    //       let blogID: string = blog.blogID.toString();

    //       //return the blog id to the user
    //       res.send(blogID);
    //     }
    //     //console.log(req.body.content);
    //   } catch (e) {
    //     res.sendStatus(400);
    //     console.log(e);
    //     throw new Error(e);
    //   }
    // });


    //Receive a blog's text content and update the blog data (so this should be a patch to something like /blog/{blogID})
    //Possible request body parameters: content, title, titleImagePath, username
    //Method One: Part of method one. To post image and create blog resource. Then patch resource with text content.
    //            Decided to refactor this. 
    // this.router.patch('/blog/:blogID', this.auth.authenitcateJWT, async (req: Request, res: Response) => {
    //   try {

    //     //store incoming request parameters 
    //     let blog: IBlog = new Blog();

    //     //TODO: Make blog method to do this not controller logic 
    //     //determine which blog properties are being patched based off request body parameters
    //     if (req.body.content !== null && req.body.content !== undefined) {
    //       blog.content = req.body.content;
    //     }

    //     //blog title
    //     if (req.body.title !== null && req.body.title !== undefined) {
    //       blog.title = req.body.title;
    //     }

    //     //blog's path to titleimage
    //     if (req.body.titleImagePath !== null && req.body.titleImagePath !== undefined) {
    //       blog.titleImagePath = req.body.titleImagePath;
    //     }

    //     //blog's username value -- TODO: Determine if this is necessary here
    //     if (req.body.username !== null && req.body.username !== undefined) {
    //       blog.username = req.body.username;
    //     }

    //     //set blog object's blogID using the incoming request parameter
    //     blog.blogID = parseInt(req.params.blogID);

    //     //update the corresponding blog -- properties not being patched stay as Blog object constructor defaults
    //     await this.repo.update(blog);

    //     console.log("Successful update!");

    //     //send no content success
    //     res.sendStatus(204);
    //   } catch (e) {
    //     console.error(e);
    //     res.sendStatus(400);
    //   }

    // });

    this.router.post('/blog', this.auth.authenitcateJWT, async (req: Request, res: Response) => {

    });

    //allow the user to edit a blog
    this.router.get('/blog/edit/:blogID', this.auth.authenitcateJWT, async (req: Request, res: Response) => {
      try {
        //retrieve the BlogID parameter
        let blogID: string = req.params.blogID;

        //retrieve the blog information using the blogID
        let blog: IBlog = await this.repo.find(searchParameters.BlogID, blogID);

        //retrieve the username from the cookie
        let username: string = res.locals.userId;

        //check if the username in the blog properties matches the username of the user making the request
        if (!blog.creator(username)) {
          //If not stop and return unauthorized b/c the user did not create this blog
          res.sendStatus(401);
          return;
        }

        //set path to the image from the Views directory [views are in /Views] using absolute paths
        //TODO: Use env to get absolute path not hardcoded string. Add this code to some model?
        let imagePath: string = "http://localhost:3000/" + path.normalize(blog.titleImagePath);

        //change \ to / in blog's path to the title image
        imagePath = imagePath.replace(/\\/g, "/");

        //direct the user to the blog edit view with blog parameters
        res.render('EditBlog', {
          title: blog.title,
          titleImagePath: imagePath,
          content: blog.content
        });

      } catch (e) {
        res.sendStatus(400);
        throw new Error(e);
      }
    });


    //register router with the app
    app.use(this.router);
  }


}