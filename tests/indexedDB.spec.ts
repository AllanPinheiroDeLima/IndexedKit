import { describe, expect, it } from "vitest";
import { DataStore } from "@src/index"
describe("indexedDB", () => {
  it("Should work", async () => {
    const datastore = new DataStore("test", "test");
    await datastore.init()
  })
})