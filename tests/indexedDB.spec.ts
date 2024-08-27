import { describe, expect, it } from "vitest";
import { DataStore } from "@src/index"
import { DatabaseNotDefinedError } from "@src/errors/DatabaseNotDefined.error";
describe("indexedDB instance", () => {
  describe("Should throw an error if any operation is tried without calling init", () => {
    it("Calling insert", async () => {
      const datastore = new DataStore("test", "test");
  
      const fnCall = async () => await datastore.insert({ name: "test" });
      expect(fnCall()).rejects.toThrow(DatabaseNotDefinedError);
    })

  })
})