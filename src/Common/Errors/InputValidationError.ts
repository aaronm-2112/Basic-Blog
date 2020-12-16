import { CustomError } from './CustomError'
import { ValidationError } from 'express-validator'

export class InputValidationError extends CustomError {
  statusCode = 400

  constructor(private errors: ValidationError[]) {
    super("Input validation errors")
    Object.setPrototypeOf(this, InputValidationError.prototype)
  }

  serializeErrors() {
    console.log(this.errors)
    return this.errors.map(error => {
      return {
        message: error.msg,
        field: error.param
      }
    })
  }
}