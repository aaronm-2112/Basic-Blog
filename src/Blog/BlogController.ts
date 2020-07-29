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
    this.router.get('/blog/:blogID/:edit', async (req: Request, res: Response) => {
      try {
        console.log("In get blog route");
        console.log(req.params.edit);

        //retrieve the blogID from the request parameter
        let blogID: string = req.params.blogID;

        //retrieve the blog object with it's ID
        let blog: IBlog = await this.repo.find(searchParameters.BlogID, blogID);

        //set path to the image from the Views directory [views are in /Views] using absolute paths
        //TODO: Use env to get absolute path not hardcoded string
        let imagePath: string = "http://localhost:3000/" + path.normalize(blog.titleImagePath);

        //check the value of edit
        if (req.params.edit === "true") {
          console.log("Editing");
          //get the userID from the cookie
          let userID: { id: string } = { id: "" };

          this.auth.setSubject(req.cookies["jwt"], userID);
          console.log("After subject function");

          //check if a userID was extracted from the incoming JWT
          if (userID.id === "silly") {
            console.log("UserID is silly");
            //if not return because there is no way to verify if the incoming user owns the blog they want to edit
            res.sendStatus(400);
            return;
          }

          //check if the incoming userID matches the username of the blog's owner -- only owners can edit their blog
          if (userID.id === blog.username) {
            //edit the blog -- TODO: Make this an edit blog page instead TODO: Make this one blog page with logic to determine this.
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
          //render the blog template with the blog's properties
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

    //create a blog resource --return blogID 
    //A blog resource contains a path to the blog's title image if one was uploaded.
    //This image path needs to be posted to the uploads path, then linked to blog with a patch request to blog.
    this.router.post('/blog', this.auth.authenitcateJWT, async (req: Request, res: Response) => {
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

    //TODO: Move this out of the blog controller and expand functionality to cover user profile image uploads.
    //create an image resource -- return unique image ID or image path
    //This blog hero image needs to be linked to a blog resource using the blog's Patch path.
    this.router.post('/uploads', this.auth.authenitcateJWT, this.upload.single("image"), async (req: Request, res: Response) => {
      try {
        //check if image is uploaded 
        if (req.file) {
          console.log(req.file);

          //extract the path to the image resource created 
          let imagePath: string = JSON.stringify(req.file.path);

          //change \ to / in blog's path to the title image
          imagePath = imagePath.replace(/\\/g, "/");

          console.log(imagePath);

          //send back the imagepath to the user
          res.send(imagePath);
        }
      } catch (e) {
        res.sendStatus(400);
        throw new Error(e);
      }
    });


    //patch a blog entity with content, titleImagePath, username, or the title as properties that can be updated
    this.router.patch('/blog/:blogID', this.auth.authenitcateJWT, async (req: Request, res: Response) => {
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
          editBlog.titleImagePath = req.body.titleImagePath;
        }

        //blog's username value -- TODO: Determine if this is necessary here
        if (req.body.username !== null && req.body.username !== undefined) {
          editBlog.username = req.body.username;
        }

        //set blog object's blogID using the incoming request parameter
        editBlog.blogID = parseInt(req.params.blogID);

        //update the corresponding blog -- properties not being patched stay as Blog object constructor defaults
        await this.repo.update(editBlog);

        console.log("Successful update!");

        //send no content success
        res.sendStatus(204);
      } catch (e) {
        console.error(e);
        res.sendStatus(400);
      }

    });



    //allow the user to edit a blog -- TODO: Change because Edit is not a resource
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