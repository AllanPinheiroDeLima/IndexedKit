import { ERROR_CODES } from "./ERROR_CODES.constants";

export class DatabaseNotDefinedError extends Error {
  constructor(message: string) {
    super("Database not initialized");
    console.log(ERROR_CODES.COD001, message, this.stack)
  }
}