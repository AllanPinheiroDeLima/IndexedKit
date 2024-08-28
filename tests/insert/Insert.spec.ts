import { DatabaseNotDefinedError } from "@src/errors/DatabaseNotDefined.error";
import { InvalidInputError } from "@src/errors/InvalidaInput.error";
import { DataStore } from "@src/index";
import { afterEach, describe, expect, it } from "vitest";
const FDBFactory = require("fake-indexeddb/lib/FDBFactory");

describe("Insert", () => {
  const databaseName = process.env.DATASTORE_DATABASE_NAME;
  const collectionName = process.env.DATASTORE_COLLECTION_NAME;

  const dataToInsert = Object.freeze({ title: "Quarry Memories", author: "Fred", isbn: 123456 });
  
  afterEach(async () => {
    global.indexedDB = new FDBFactory();
  })

  it("should throw an error when not using init before using the insert method", async () => {
    const datastore = new DataStore(databaseName, collectionName);

    const fnCall = () => datastore.insert({ title: "Quarry Memories", author: "Fred", isbn: 123456 }); 

    expect(fnCall()).rejects.toThrowError("COD001: DATABASE_NOT_INITIALIZED");
    expect(fnCall()).rejects.toThrowError(DatabaseNotDefinedError);
  });

  it("should insert an item into the database with the id defined", async () => {
    const datastore = new DataStore(databaseName, collectionName);
    await datastore.init();

    const inserted = await datastore.insert(dataToInsert); 

    expect(inserted).toStrictEqual({
      id: expect.any(String),
      ...dataToInsert
    });
  });

  it("should insert an item into the database ignoring the defined id", async () => {
    const datastore = new DataStore(databaseName, collectionName);
    await datastore.init();

    const inserted = await datastore.insert({
      id: "teste",
      ...dataToInsert
    }); 

    expect(inserted).toStrictEqual({
      id: expect.not.stringMatching("teste"),
      ...dataToInsert
    });
  });

  it("should throw an error then the user tries to insert primitive values or function", async () => {
    const datastore = new DataStore(databaseName, collectionName);
    await datastore.init();

    const insertedNumber = () => datastore.insert(1); 
    const insertedString = () => datastore.insert("string"); 
    const insertedBoolean = () => datastore.insert(false);  
    const insertedFunction = () => datastore.insert(() => {});  
    const insertedArray = () => datastore.insert([]);  

    // THE UNDEFINED AND NULL CASES ARE FOR TESTING AGAINST FORCING THE TYPES
    // ON THE input LEVEL
    // @ts-expect-error
    const insertedNull = () => datastore.insert(null);  
    // @ts-expect-error
    const insertedUndefined = () => datastore.insert(undefined);

    expect(insertedNumber()).rejects.toThrowError(InvalidInputError);
    expect(insertedString()).rejects.toThrowError(InvalidInputError);
    expect(insertedBoolean()).rejects.toThrowError(InvalidInputError);
    expect(insertedFunction()).rejects.toThrowError(InvalidInputError);
    expect(insertedNull()).rejects.toThrowError(InvalidInputError);
    expect(insertedUndefined()).rejects.toThrowError(InvalidInputError);
    expect(insertedArray()).rejects.toThrowError(InvalidInputError);
    
  });

  it("should insert an item with an id when the generateId alg is defined", async () => {
    const datastore = new DataStore(databaseName, collectionName, {
      idGenerator: () => "teste"
    });
    await datastore.init();

    const inserted = await datastore.insert(dataToInsert); 
    
    expect(inserted).toStrictEqual(expect.objectContaining({
      id: "teste",
    }));
  })
  it("should use the 'id' defined in the keyPath option", async () => {
    const datastore = new DataStore(databaseName, collectionName, {
      idKey: "isbn"
    });
    await datastore.init();

    const inserted = await datastore.insert(dataToInsert); //?

    expect(inserted).toStrictEqual(expect.objectContaining({
      ...dataToInsert,
      isbn: expect.any(String)
    }));
  })

  it("Should use the id generator and the idKey defined", async () => {
    const datastore = new DataStore(databaseName, collectionName, {
      idKey: "isbn",
      idGenerator: () => "teste"
    });
    await datastore.init();

    const inserted = await datastore.insert(dataToInsert); //?

    expect(inserted).toStrictEqual(expect.objectContaining({
      ...dataToInsert,
      isbn: "teste"
    }));
  })

  it.todo("should create the indexes correctly when defined", async () => {})
})