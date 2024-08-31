import { InvalidInputError } from "@src/errors/InvalidaInput.error";
import { DataStore } from "@src/index";
import { IDBFactory } from "fake-indexeddb";

describe("bulkInsert", () => {
  const databaseName = process.env.DATASTORE_DATABASE_NAME;
  const collectionName = process.env.DATASTORE_COLLECTION_NAME;

  afterEach(() => {
    global.indexedDB = new IDBFactory();
  })

  beforeEach(() => {
    indexedDB.open(databaseName, 3).onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(collectionName, { keyPath: "id" });
    }
  });

  it("should insert multiple records", async () => {
    const datastore = new DataStore(databaseName, collectionName);
    await datastore.init();

    const data = [
      { name: "John Doe" },
      { name: "Jane Doe" },
      { name: "Alice" },
    ];

    const result = await datastore.bulkInsert(data, collectionName);

    expect(result).length(3);
  })

  it("should throw an error if the input is wrong", async () => {
    const datastore = new DataStore(databaseName, collectionName);
    await datastore.init();

    const data = [""];

    const fnCall = () => datastore.bulkInsert(data, "wrong-collection");
    expect(fnCall()).rejects.toThrowError();
    expect(fnCall()).rejects.toBeInstanceOf(InvalidInputError);
  })

  it("Should throw an error and not insert any record", async () => {
    const datastore = new DataStore(databaseName, collectionName);
    await datastore.init();

    const data = [
      { name: "John Doe" },
      ""
    ];
    
    const data2 = [
      "",
      { name: "John Doe" },
    ];

    const fnCall1 = () => datastore.bulkInsert(data, collectionName);
    expect(fnCall1()).rejects.toThrowError();

    const fnCall2 = () => datastore.bulkInsert(data2, collectionName);
    expect(fnCall2()).rejects.toThrowError();

    const result = await datastore.findAll();

    expect(result).length(0);
  })
})