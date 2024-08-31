import { DataStore } from "@src/index";
import { BookSchema } from "../find/FindAll.spec";

describe("findOne", () => {
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

  it("should find a record by id", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();

    const data = await datastore.findOne({ where: { isbn: 234567 } }, collectionName);

    console.log(data)
    expect(data).toStrictEqual(expect.objectContaining({
      title: "Water Buffaloes"
    }));
  })
})