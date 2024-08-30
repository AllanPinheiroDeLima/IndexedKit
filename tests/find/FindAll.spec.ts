import { DataStore } from "@src/index";
import { beforeEach, describe, expect, it } from "vitest";

export type BookSchema = {
  title: string;
  author: string;
  isbn: number;
} & { id?: string }

describe("findAll", () => {
  const databaseName = process.env.DATASTORE_DATABASE_NAME;
  const collectionName = process.env.DATASTORE_COLLECTION_NAME;

  beforeEach(() => {
    var request = indexedDB.open(databaseName, 3);

    request.onupgradeneeded = function () {
        const db = request.result;
        const store = db.createObjectStore(collectionName, {keyPath: "isbn"});
        store.createIndex("by_title", "title", {unique: true});

        store.put({title: "Quarry Memories", author: "Fred", isbn: 123456});
        store.put({title: "Water Buffaloes", author: "Fred", isbn: 234567});
        store.put({title: "Bedrock Nights", author: "Barney", isbn: 345678});
    }
  })

  it("Should find all when no options are passed", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();

    const data = await datastore.findAll();
    expect(data).length(3)
  })

  it("Should find one item with ISBN 234567", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();

    const findOnlyOneByISBN = await datastore.findAll({
      where: {
        isbn: 234567
      }
    });
    
    expect(findOnlyOneByISBN).length(1)
  })

  it("Should find one item with title Quarry Memories", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();

    const findOnlyOneByTitle = await datastore.findAll({
      where: {
        title: "Quarry Memories"
      }
    });
    
    expect(findOnlyOneByTitle).length(1)
  })

  it("Should find two items when author is set to Fred", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();

    const data = await datastore.findAll({
      where: {
        author: "Fred"
      }
    });

    expect(data).length(2)
  })

  it("Should apply the limit when set", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();

    const dataLimitedBy1 = await datastore.findAll({
      limit: 1
    });

    const dataLimitedBy2 = await datastore.findAll({
      limit: 2
    });

    expect(dataLimitedBy1).length(1)
    expect(dataLimitedBy2).length(2)
  });

  it("Should apply the offset when bring out the docs", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();

    const dataLimitedOffsetedBy1 = await datastore.findAll({
      offset: 1
    });

    const dataLimitedOffsetedBy2 = await datastore.findAll({
      offset: 2
    });

    expect(dataLimitedOffsetedBy1).length(2)
    expect(dataLimitedOffsetedBy1.map(data => data.isbn)).toStrictEqual([234567, 345678])
    
    expect(dataLimitedOffsetedBy2).length(1)
    expect(dataLimitedOffsetedBy2.map(data => data.isbn)).toStrictEqual([345678])
  })
})