import { describe, expect, it } from "vitest";
import { DataStore } from "@src/index"
import { DatabaseNotDefinedError } from "@src/errors/DatabaseNotDefined.error";
describe("indexedDB", () => {
  it("Should work", async () => {
    const datastore = new DataStore("test", "test");
    // await datastore.init();

    const fnCall = async () => await datastore.insert({ name: "test" });
    console.log("Cheguei aqui")
    expect(fnCall()).rejects.toBeInstanceOf(DatabaseNotDefinedError);
  })
})