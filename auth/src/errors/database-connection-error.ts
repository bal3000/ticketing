import { CustomError } from './custom-error.interface';

export class DatabaseConnectionError extends Error implements CustomError {
  statusCode = 500;
  reason = 'Error connecting to database';

  constructor() {
    super();

    // Only becuase we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
