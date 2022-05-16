class Error {
  public readonly message: string;

  public readonly statusCode: number;

  public readonly validationErrors: {
    [key: string]: string;
  };

  constructor(message: string, statusCode = 400, validationErrors = {}) {
    this.message = message;
    this.statusCode = statusCode;
    this.validationErrors = validationErrors;
  }
}

export default Error;
