/**
 * Application-level error with an HTTP status code attached.
 * Throw this from the service layer when you want the API route
 * to return a specific status + message instead of a generic 500.
 */
export class AppError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode = 400, code?: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
  }
}