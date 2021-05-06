export abstract class CustomErrors extends Error {
  abstract statusCode: number;
  constructor(error?: string) {
    super(error);
    Object.setPrototypeOf(this, CustomErrors.prototype);
  }
  abstract serializeError(): { message: string | any; field?: string }[];
}
