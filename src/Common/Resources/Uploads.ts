import Auth from '../../Auth/Auth';
import multer from 'multer';
import { Request, Response } from 'express';
import * as express from 'express';
import path from 'path';

export default async function Upload(app: express.Application) {
  //create resources
  let auth: Auth = new Auth();
  let upload = multer({ dest: 'uploads/' });


  //create an image resource -- return unique image ID or image path
  //This blog hero image needs to be linked to a blog resource using the blog's Patch path.
  //TODO: Return uri location in the header
  app.post('/uploads', auth.authenitcateJWT, upload.single("image"), async (req: Request, res: Response) => {
    try {
      //check if image is uploaded 
      if (req.file) {
        console.log(req.file);

        //extract the path to the image resource created 
        let imagePath: string = JSON.stringify(req.file.path);

        //replace double // with /
        imagePath = path.normalize(imagePath);

        //change \ to / in blog's path to the title image
        imagePath = imagePath.replace(/\\/g, "/");

        console.log(imagePath);

        //send back the imagepath to the user
        res.status(201).send(imagePath);
      }
    } catch (e) {
      res.sendStatus(400);
      throw new Error(e);
    }
  });
}

