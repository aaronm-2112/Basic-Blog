import { CustomError } from './CustomError'

export class ForbiddenError extends CustomError {
  statusCode = 403

  constructor(msg: string) {
    super(msg)
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}