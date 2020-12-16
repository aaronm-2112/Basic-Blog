import { CustomError } from './CustomError'

export class BadRequestError extends CustomError {
  statusCode = 400

  constructor() {
    super("Unable to process the request")
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors() {
    return [{
      "message": this.message
    }]
  }
}