import { CustomError } from "./CustomError";

export class UnAuthorizedError extends CustomError {
    constructor(...args: any[]) {
      super(...args);
      this.name = 'UnAuthorizedError';
    }
  }