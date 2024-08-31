import { DataStore } from "@src/index";
import { BookSchema } from "../find/FindAll.spec";

describe("upsert", () => {
  const databaseName = process.env.DATASTORE_DATABASE_NAME;
  const collectionName = process.env.DATASTORE_COLLECTION_NAME;

  afterEach(() => {
    global.indexedDB = new IDBFactory();
  })

  beforeEach(() => {
    var request = indexedDB.open(databaseName, 3);

    request.onupgradeneeded = function () {
      const db = request.result;
      const store = db.createObjectStore(collectionName, {keyPath: "isbn"});

      store.put({title: "Quarry Memories", author: "Fred", isbn: 123456, age: 1});
      store.put({title: "Water Buffaloes", author: "Fred", isbn: 234567, age: 2});
      store.put({title: "Bedrock Nights", author: "Barney", isbn: 345678, age: 3});
    }
  })

  it("should overwrite the record if it exists", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();

    const data = {title: "Memories Quarry", author: "Frank", isbn: 234567};

    await datastore.upsert({ where: { isbn: 234567 } }, data, collectionName);

    indexedDB.open(databaseName, 3).onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(collectionName, "readonly");
      const store = transaction.objectStore(collectionName);
      const request = store.get(234567);

      request.onsuccess = () => {
        expect(request.result).toStrictEqual(expect.not.objectContaining({
          age: expect.anything()
        }));

        expect(request.result).toStrictEqual(data)
      }
    }
  })

  it("should insert the record if it does not exist", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();

    const data = {title: "Memories Quarry", author: "Frank", isbn: 987654};

    await datastore.upsert({ where: { isbn: 987654 } }, data, collectionName);

    indexedDB.open(databaseName, 3).onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(collectionName, "readonly");
      const store = transaction.objectStore(collectionName);
      const request = store.get(987654);

      request.onsuccess = () => {
        expect(request.result).toStrictEqual(data)
      }
    }
  })

  it("should throw an error if the input is wrong", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();

    const data = {title: "Memories Quarry", author: "Frank", isbn: 987654};

    const fnCall = () => datastore.upsert({ where: { isbn: 987654 } }, data, "wrong-collection");
    expect(fnCall()).rejects.toThrowError();
    expect(fnCall()).rejects.toBeInstanceOf(Error);
  })
})