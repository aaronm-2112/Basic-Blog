import { NextFunction, Request, Response } from "express";
import { validationResult } from 'express-validator'
import { InputValidationError } from "../Common/Errors/InputValidationError";

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req).array()

  if (errors.length) {
    throw new InputValidationError(errors)
  }

  next()
}