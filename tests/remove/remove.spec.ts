import { DataStore } from "@src/index";
import { BookSchema } from "../find/FindAll.spec";

describe("remove", () => {
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

  it("should remove a record by id", async () => {
    // POR ALGUM MOTIVO, O SET UP DO ISBN NO TESTE DE CIMA FOI SOBRESCRITO ABAIXO
    // ISSO É UM POSSÍVEL BUG QUE TEM QUE SER AVALIADO
    const datastore = new DataStore<BookSchema>(databaseName, collectionName, {
      idKey: "isbn"
    });
    await datastore.init();

    await datastore.remove({ where: { isbn: 234567 } }, collectionName);

    indexedDB.open(databaseName, 3).onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(collectionName, "readonly");
      const store = transaction.objectStore(collectionName);
      const request = store.get(234567);

      request.onsuccess = () => {
        expect(request.result).toBeUndefined();
      }
    }
  })
})