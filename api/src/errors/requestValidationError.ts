import { CustomErrors } from './custom-error';
import { ValidationError } from 'express-validator';

export class RequestValidationError extends CustomErrors {
  statusCode: number = 400;
  constructor(public errors: ValidationError[]) {
    super('Validation error');
    this.errors = errors;

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeError() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
