import { DataStore } from "@src/index";

describe("clearCollection", () => {
  const databaseName = process.env.DATASTORE_DATABASE_NAME;
  const collectionName = process.env.DATASTORE_COLLECTION_NAME

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
  it("should clear the collection", async () => {
    const datastore = new DataStore(databaseName, collectionName);
    await datastore.init();

    const result = await datastore.clearCollection(collectionName);

    expect(result).toBeUndefined();
    expect(datastore.findAll()).resolves.toHaveLength(0);
  })

  it("should throw an error if the collection does not exist", async () => {
    const datastore = new DataStore(databaseName, collectionName);
    await datastore.init();

    const fnCall = () => datastore.clearCollection("wrong-collection");
    expect(fnCall()).rejects.toThrowError();
    expect(fnCall()).rejects.toBeInstanceOf(Error);
  })
})