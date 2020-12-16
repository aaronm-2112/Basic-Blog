import { CustomError } from './CustomError'

export class NotAcceptableError extends CustomError {
  statusCode = 406

  constructor() {
    super("Request does not accept Content-Type being returned")
    Object.setPrototypeOf(this, NotAcceptableError.prototype)
  }

  serializeErrors() {
    return [{
      "message": this.message
    }]
  }
}