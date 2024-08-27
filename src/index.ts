

export class DataStore {
  protected isOpen: boolean = false;
  protected database: IDBDatabase;

  private databaseName: string;
  private collectionName: string;

  constructor(databaseName: string, collectionName: string, version?: number) {
    this.databaseName = databaseName;
    this.collectionName = collectionName;
  }

  public async init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const DBOpenRequest = window.indexedDB.open(this.databaseName);

      DBOpenRequest.onsuccess = (event) => {
        console.log("onsuccess");

        const database = event.target.result;
        this.database = database;

        resolve(database);
      };

      DBOpenRequest.onupgradeneeded = (event) => {
        console.log("onupgradeneeded");
        const database = event.target.result;
        this.database = database;

        this.createCollection(this.collectionName);

        resolve(database);
      };

      DBOpenRequest.onerror = (event) => {
        console.error("indexed db didn't open", event);
        reject(event);
      };
    });
  }

  private createCollection(collectionName: string) {
    if (this.database.objectStoreNames.contains(collectionName)) {
      return;
    }

    this.database.createObjectStore(collectionName, {
      keyPath: "id"
    });
  }

  private async openDatabase(databaseName?: string) {
    this.databaseName = databaseName ?? this.databaseName;
    return this.init();
  }

  private startTransaction(
    type: "readonly" | "readwrite",
    collectionName?: string
  ) {
    return this.database.transaction(
      [collectionName ?? this.collectionName],
      type
    );
  }

  private getCollection(transaction: IDBTransaction, collectionName?: string) {
    return transaction.objectStore(collectionName ?? this.collectionName);
  }

  public async findAll<T>(findOptions?: Record<string, unknown>) {
    const transaction = this.startTransaction("readonly");
  }

  public async insert<T>(doc: T, collectionName?: string): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const database = await this.openDatabase(this.databaseName);
      const transaction = database.transaction(
        [this.collectionName],
        "readwrite"
      );
      const collection = this.getCollection(transaction, collectionName);

      transaction.onerror = (event) => {
        console.log(event);
      };

      const id = Math.random();
      
      const docToSave = {
        id,
        ...doc
      }
      
      const request = collection.add(docToSave);

      request.onsuccess = (event) => {
        console.log("INserted", event.target?.result);
        resolve(docToSave)
      };

      request.onerror = (event) => {
        console.log("error on insert", event);
        reject(event)
      };

      console.log("finished");
    });
  }
}

async function main() {
  const datastore = new DataStore("meudatabase", "exames");
  console.log(await datastore.init());

  await datastore.insert({ name: "Allan" });
}

main();
