export class DatabaseConnectionError extends Error {
  reason = 'Error connecting to database';
  constructor() {
    super();

    // Only becuase we are extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
