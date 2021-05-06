import { CustomErrors } from '../custom-error';

export class ForbiddenError extends CustomErrors {
  statusCode: number = 403;
  constructor() {
    super('This route is forbidden!');
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
  serializeError() {
    return [
      {
        message: 'This route is forbidden!',
      },
    ];
  }
}
