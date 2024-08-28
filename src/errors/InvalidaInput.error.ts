import { ERROR_CODES } from "./ERROR_CODES.constants";

export class InvalidInputError extends Error {
  constructor(message?: string) {
    super(`COD003: ${ERROR_CODES.COD003}`);

    console.warn("Valores primitivos não podem ser usados como valores de entrada");
  }
}