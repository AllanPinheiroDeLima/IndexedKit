import { ERROR_CODES } from "./ERROR_CODES.constants";

export class DatabaseNotDefinedError extends Error {
  constructor(message: string) {
    super(`COD001: ${ERROR_CODES.COD001}`);
  }
}