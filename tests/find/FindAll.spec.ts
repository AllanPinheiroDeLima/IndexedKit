import { DataStore } from "@src/index";
import { beforeEach, describe, expect, it } from "vitest";

type BookSchema = {
  title: string;
  author: string;
  isbn: number;
}

describe("findAll", () => {

  beforeEach(() => {
    var request = indexedDB.open("test", 3);

    request.onupgradeneeded = function () {
        var db = request.result;
        var store = db.createObjectStore("books", {keyPath: "isbn"});
        store.createIndex("by_title", "title", {unique: true});

        store.put({title: "Quarry Memories", author: "Fred", isbn: 123456});
        store.put({title: "Water Buffaloes", author: "Fred", isbn: 234567});
        store.put({title: "Bedrock Nights", author: "Barney", isbn: 345678});
    }
  })

  it("Should find all when no options are passed", async () => {
    const datastore = new DataStore<BookSchema>("test", "books");
    await datastore.init();

    const data = await datastore.findAll();
    expect(data).length(3)
  })

  it("Should find one item with ISBN 234567", async () => {
    const datastore = new DataStore<BookSchema>("test", "books");
    await datastore.init();

    const findOnlyOneByISBN = await datastore.findAll({
      where: {
        isbn: 234567
      }
    });
    
    expect(findOnlyOneByISBN).length(1)
  })

  it("Should find one item with title Quarry Memories", async () => {
    const datastore = new DataStore<BookSchema>("test", "books");
    await datastore.init();

    const findOnlyOneByTitle = await datastore.findAll({
      where: {
        title: "Quarry Memories"
      }
    });
    
    expect(findOnlyOneByTitle).length(1)
  })

  it("Should find two items when author is set to Fred", async () => {
    const datastore = new DataStore<BookSchema>("test", "books");
    await datastore.init();

    const data = await datastore.findAll({
      where: {
        author: "Fred"
      }
    });

    expect(data).length(2)
  })
})