import { DataStore } from "@src/index";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { BookSchema } from "../find/FindAll.spec";

describe("removeById", () => {
  const databaseName = process.env.DATASTORE_DATABASE_NAME;
  const collectionName = process.env.DATASTORE_COLLECTION_NAME;

  afterEach(() => {
    global.indexedDB = new IDBFactory();
  });

  it("Should remove an item by id", () => new Promise(async done => {
    // SETUP 
    const request = indexedDB.open(databaseName, 3);

    request.onupgradeneeded = function () {
        const db = request.result;
        const store = db.createObjectStore(collectionName, {
          keyPath: "id"
        });

        store.put({title: "Quarry Memories", author: "Fred", isbn: 123456, id: "1a"});
        store.put({title: "Water Buffaloes", author: "Fred", isbn: 234567, id: "2b"});
        store.put({title: "Bedrock Nights", author: "Barney", isbn: 345678, id: "3b"});
    }

    // EXECUTE
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();

    await datastore.removeByIdKey("1a");
    
    indexedDB.open(databaseName).onsuccess = (event) => {
      // @ts-expect-error
      const db = event.target?.result;
      const tx = db.transaction(collectionName, "readonly");
      const store = tx.objectStore(collectionName) as IDBObjectStore;
      const request = store.getAll();

      request.onsuccess = (event) => {
        // @ts-expect-error
        const result = event.target.result;
        expect(result).toHaveLength(2);
        expect(result.find((item: any) => item.id === "1a")).toBeUndefined();
        done(null)
      }
    }
  }))

  it("Should remove an item by id when user enables idKeys to set the keypath", () => new Promise(async done => {
    const request = indexedDB.open(databaseName, 3);

    request.onupgradeneeded = function () {
        const db = request.result;
        const store = db.createObjectStore(collectionName, {
          keyPath: "isbn"
        });

        store.put({title: "Quarry Memories", author: "Fred", isbn: 123456, id: "1a"});
        store.put({title: "Water Buffaloes", author: "Fred", isbn: 234567, id: "2b"});
        store.put({title: "Bedrock Nights", author: "Barney", isbn: 345678, id: "3b"});
    }

    const datastore = new DataStore<BookSchema>(databaseName, collectionName, {
      idKey: "isbn"
    });

    await datastore.init();

    await datastore.removeByIdKey(234567);

    indexedDB.open(databaseName).onsuccess = (event) => {
      // @ts-expect-error
      const db = event.target?.result;
      const tx = db.transaction(collectionName, "readonly");
      const store = tx.objectStore(collectionName) as IDBObjectStore;
      const request = store.getAll();

      request.onsuccess = (event) => {
        // @ts-expect-error
        const result = event.target.result;
        expect(result).toHaveLength(2);
        expect(result.find((item: any) => item.id === "2b")).toBeUndefined();
        done(null)
      }
    }
  }))
})