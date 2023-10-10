export class CustomError extends Error {
  constructor(
    message?: string,
    public code?: string,
  ) {
    super(message || code);
    this.name = "CustomBadRequest";
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
