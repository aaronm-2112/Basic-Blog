import { CustomError } from './CustomError'

export class NotAuthenticatedError extends CustomError {
  statusCode = 401

  constructor() {
    super("User is not logged in")
    Object.setPrototypeOf(this, NotAuthenticatedError.prototype)
  }
}