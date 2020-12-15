// Purpose: An easily extensible middleware that places error handling and client response code in one spot

import { Request, NextFunction, Response } from 'express'
import { CustomError } from '../Common/Errors/CustomError'


export const handler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // check if the incoming error is a custom error 
  if (err instanceof CustomError) {
    // send the user the error message
    return res.status(err.statusCode).send(err.message)
  }

  // log any errors that were unexpected
  console.log(err)

  // send a generic error status and message back to the user (this error type is unexpected)
  res.status(400).send("Something went wrong with your request")
}
