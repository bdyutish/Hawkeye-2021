import { CustomErrors } from './custom-error';

export class MiscError extends CustomErrors {
  constructor(public statusCode: number, public mes: string) {
    super(mes);
    this.mes = mes;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, MiscError.prototype);
  }
  serializeError() {
    return [
      {
        message: this.mes,
      },
    ];
  }
}
