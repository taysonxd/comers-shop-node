
export class AppError extends Error {
    status: number;
    error: any;

    constructor(message: any, status = 500, error?: any) {
      super(message);            
      this.status = status;
      this.error = error;
      Error.captureStackTrace(this, this.constructor);
    }

}
  