import { ERROR_CODES } from "./ERROR_CODES.constants";

export class CollectionNotFoundError extends Error {
  constructor(message?: string) {
    super(`COD002: ${ERROR_CODES.CODOO2}`);

    console.warn("The collection does not exist");
  }
}