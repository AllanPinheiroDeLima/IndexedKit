import { ERROR_CODES } from "./ERROR_CODES.constants";

export class DocumentNotFoundError extends Error {
  constructor(message?: string) {
    super(`COD004: ${ERROR_CODES.COD004}`);

    console.warn("The document was not found");
  }
}