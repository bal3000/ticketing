import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error.interface';

export class RequestValidationError extends Error implements CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super();

    // Only becuase we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((e) => ({
      message: e.msg,
      field: e.param,
    }));
  }
}
