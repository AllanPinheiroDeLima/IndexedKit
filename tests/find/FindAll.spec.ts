import { DataStore } from "@src/index";
import { IDBFactory } from "fake-indexeddb";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

export type BookSchema = {
  title: string;
  author: string;
  isbn: number;
  age?: number
} & { id?: string }

describe("findAll", () => {
  const databaseName = process.env.DATASTORE_DATABASE_NAME;
  const collectionName = process.env.DATASTORE_COLLECTION_NAME;

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

  afterEach(() => {
    globalThis.indexedDB = new IDBFactory();
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

  it("Should find 1 item when setting gt bigger than 2", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();
    
    const data = await datastore.findAll({
      where: {
        $gt: {
          age: 2
        }
      }
    });
    
    expect(data).length(1)
    expect(data.at(0)).toStrictEqual(expect.objectContaining({
      age: 3
    }))
  })

  it("Should find 1 item when setting lt lees than 2", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();
    
    const data = await datastore.findAll({
      where: {
        $lt: {
          age: 2
        }
      }
    });
    
    expect(data).length(1)
    expect(data.at(0)).toStrictEqual(expect.objectContaining({
      age: 1
    }))
  })
  it("Should find 1 item when setting gte bigger or equal 2", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();
    
    const data = await datastore.findAll({
      where: {
        $gte: {
          age: 2
        }
      }
    });
    
    expect(data).length(2)

    const dataFilteredWithAge2 = data.find(data => data.age === 2)
    const dataFilteredWithAge3 = data.find(data => data.age === 3)

    expect(dataFilteredWithAge2).not.toBeUndefined()
    expect(dataFilteredWithAge2).toStrictEqual(expect.objectContaining({
      age: 2
    }))

    expect(dataFilteredWithAge3).not.toBeUndefined()
    expect(dataFilteredWithAge3).toStrictEqual(expect.objectContaining({
      age: 3
    }))
  })

  it("Should find 1 item when setting lte less or equal 2", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();
    
    const data = await datastore.findAll({
      where: {
        $lte: {
          age: 2
        }
      }
    });
    
    expect(data).length(2)

    const dataFilteredWithAge2 = data.find(data => data.age === 2)
    const dataFilteredWithAge1 = data.find(data => data.age === 1)

    expect(dataFilteredWithAge2).not.toBeUndefined()
    expect(dataFilteredWithAge2).toStrictEqual(expect.objectContaining({
      age: 2
    }))

    expect(dataFilteredWithAge1).not.toBeUndefined()
    expect(dataFilteredWithAge1).toStrictEqual(expect.objectContaining({
      age: 1
    }))
  })

  it("Should find 2 items when setting regex to fred", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();
    
    await datastore.insert({title: "Water Buffaloes 2", author: "Frank", isbn: 234512, age: 2});
    await datastore.insert({title: "Water Buffaloes 2", author: "froid", isbn: 234598, age: 2});

    const dataRegexString = await datastore.findAll({
      where: {
        $regex: {
          author: "Fr"
        }
      }
    });

    const dataRegexExpression = await datastore.findAll({
      where: {
        $regex: {
          author: new RegExp("Fr", "i")
        }
      }
    });

    const dataRegexNumbers = await datastore.findAll({
      where: {
        $regex: {
          isbn: /234/g
        }
      }
    })
    
    expect(dataRegexString).length(3)
    expect(dataRegexExpression).length(4)
    expect(dataRegexNumbers).length(4)
  })
  
  it("Should find 2 items when setting $in to 234567 and 345678", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();

    const data = await datastore.findAll({
      where: {
        $in: {
          isbn: [234567, 345678]
        }
      }
    });

    expect(data).length(2)
    expect(data.map(data => data.isbn)).toStrictEqual([234567, 345678])
  })

  it("Should find 1 items when setting $nin to 234567 and 345678", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();

    const data = await datastore.findAll({
      where: {
        $nin: {
          isbn: [234567, 345678]
        }
      }
    });

    expect(data).length(1)
    expect(data.map(data => data.isbn)).toStrictEqual([123456])
  })

  it("Should find 2 items when setting $ne to 234567", async () => {
    const datastore = new DataStore<BookSchema>(databaseName, collectionName);
    await datastore.init();

    const data = await datastore.findAll({
      where: {
        $ne: {
          isbn: 234567
        }
      }
    });

    expect(data).length(2)
    expect(data.map(data => data.isbn)).toStrictEqual([123456, 345678])
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