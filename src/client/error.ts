export class TimeoutError extends Error {
  constructor() {
    super("Timeout error");
  }
}

export class HttpError<T = any> extends Error {
  constructor(
    private readonly statusCode: number,
    private readonly response: T
  ) {
    super("Http error");
  }

  public getStatusCode(): number {
    return this.statusCode;
  }

  public getResponse(): T {
    return this.response;
  }
}
