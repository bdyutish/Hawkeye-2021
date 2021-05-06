import { CustomErrors } from '../custom-error';

export class BadRequestError extends CustomErrors {
  statusCode: number = 400;
  constructor(public mes: string) {
    super(mes);
    this.mes = mes;

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeError() {
    return [
      {
        message: this.mes,
      },
    ];
  }
}
