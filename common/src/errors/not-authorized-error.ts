import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not Authorized');
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): import('./error-message.interface').ErrorMessage[] {
    return [{ message: 'Not Authorized' }];
  }
}
