export interface CustomError extends Error {
  serializeErrors(): ErrorMessage[];
  statusCode: number;
}

export interface ErrorMessage {
  message: string;
  field?: string;
}
