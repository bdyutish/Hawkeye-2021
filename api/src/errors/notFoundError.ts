import { CustomErrors } from './custom-error';

export class NotFoundError extends CustomErrors {
  statusCode: number = 404;
  constructor() {
    super('Not Found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeError() {
    return [
      {
        message: 'Not Found',
      },
    ];
  }
}
