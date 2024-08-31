import { describe, expect, it } from "vitest";
import { DataStore } from "@src/index"
import { DatabaseNotDefinedError } from "@src/errors/DatabaseNotDefined.error";
describe("indexedDB instance", () => {
  const databaseName = process.env.DATASTORE_DATABASE_NAME;
  const collectionName = process.env.DATASTORE_COLLECTION_NAME;
  describe("Should throw an error if any operation is tried without calling init", () => {
    it("Calling insert", async () => {
      const datastore = new DataStore(databaseName, collectionName);
  
      const fnCall = async () => await datastore.insert({ name: "test" });
      expect(fnCall()).rejects.toThrow(DatabaseNotDefinedError);
    })

    it("Should create the indexes", async () => {
      const datastore = new DataStore(databaseName, collectionName, {
        indexes: [
          { name: "name_idx", keyPath: "name", unique: true },
          { name: "isbn_idx", keyPath: "isbn", unique: false }
        ]
      });

      await datastore.init();

      indexedDB.open(databaseName).onsuccess = (event) => {
        const db = event.target?.result as IDBDatabase;
        const transaction = db.transaction(collectionName, "readonly");

        // get indexes
        const indexes = transaction.objectStore(collectionName).indexNames;
        const nameIdx = transaction.objectStore(collectionName).index("name_idx")
        const isbnIdx = transaction.objectStore(collectionName).index("isbn_idx")
        
        expect(indexes).length(2);
        expect(indexes).toContain("name_idx");
        expect(indexes).toContain("isbn_idx");

        expect(isbnIdx.unique).toBe(false);
        expect(nameIdx.unique).toBe(true);

        expect(isbnIdx.keyPath).toBe("isbn");
        expect(nameIdx.keyPath).toBe("name");
      };
    })

    it("Should polyfill the structureClone algorithm if it doesn't exist", async () => {
      // @ts-expect-error
      delete global.structuredClone

      const datastore = new DataStore(databaseName, collectionName);
      await datastore.init();

      expect(globalThis.structuredClone).toBeDefined();
    })

  })
})