class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public details: Record<string, any> = {},
  ) {
    super(message);
    this.name = 'Exception validate';
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
