import { v7 as GenId } from "uuid";
import { DatabaseNotDefinedError } from "./errors/DatabaseNotDefined.error";
import { InvalidInputError } from "./errors/InvalidaInput.error";
type IndexOpt = {
  name: string
  keyPath: string
  unique: boolean
}

type DataStoreOptions = {
  idGenerator?: (...args: any[]) => string
  idKey?: string
  version?: number
  indexes?: Array<IndexOpt>
}

type FindModifiers = {
  $eq?: string
  $gt?: number
  $gte?: number
  $lt?: number
  $lte?: number
  $ne?: string
  $in?: string[]
  $nin?: string[]
  $regex?: RegExp
}

type FindModifiersWithType<T> = {
  [K in keyof T]?: FindModifiers | T[K];
}

type FindOptions<T> = {
  limit?: number
  offset?: number
  where?: FindModifiersWithType<T>
}

type BaseResponse<T> = { [K in keyof T]: T[K] }

export class DataStore<T extends Object> {
  protected isOpen: boolean = false;
  protected database!: IDBDatabase;
  protected dataStoreOptions: DataStoreOptions;

  private databaseName: string;
  private collectionName: string;

  constructor(databaseName: string, collectionName: string, options?: DataStoreOptions) {
    this.databaseName = databaseName;
    this.collectionName = collectionName;
    this.dataStoreOptions = options ?? {} as DataStoreOptions;
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

  private validateDatabaseExistence() {
    if (!this.database) {
      return new DatabaseNotDefinedError("Database not initialized");
    }

    return null
  }

  private createCollection(collectionName: string) {
    console.log("datastore da collection", this.dataStoreOptions?.idKey)
    if (this.database.objectStoreNames.contains(collectionName)) {
      return;
    }

    this.database.createObjectStore(collectionName, {
      keyPath: this.dataStoreOptions?.idKey ?? "id"
    });
  }

  private async openDatabase(databaseName?: string): Promise<IDBDatabase> {
    this.databaseName = databaseName ?? this.databaseName;
    return this.init();
  }

  private getCollection(transaction: IDBTransaction, collectionName?: string) {
    return transaction.objectStore(collectionName ?? this.collectionName);
  }

  private generateId() {
    return this.dataStoreOptions?.idGenerator?.() ?? GenId({ msecs: Date.now() })
  }

  private setupTransaction(database: IDBDatabase, type: IDBTransactionMode) {
    const transaction = database.transaction(
      [this.collectionName],
      type
    );

    transaction.onerror = (event) => {
      console.log(event);
    };

    return transaction;
  }
  private isInputValid(input: unknown) {
    const isObject = input === Object(input);
    if ((!Array.isArray(input) && isObject) && typeof input !== "function") {
      return true
    }
    
    return new InvalidInputError("Invalid input");
  }

  public async insert<T extends {}>(doc: T & { id?: string }, collectionName?: string): Promise<BaseResponse<T>> {

    return new Promise(async (resolve, reject) => {
      const isInputValid = this.isInputValid(doc);

      if (isInputValid instanceof InvalidInputError) {
        return reject(isInputValid);
      }

      const doesDatabaseNotExist = await this.validateDatabaseExistence();
      
      if (doesDatabaseNotExist) {
        return reject(doesDatabaseNotExist)
      }

      const database = await this.openDatabase(this.databaseName);
      const transaction = this.setupTransaction(database, "readwrite");
      const collection = this.getCollection(transaction, collectionName);
      
      const id = this.generateId();
      
      let docToSave = {
        ...doc,
        [this.dataStoreOptions.idKey ?? "id"]: this.dataStoreOptions.idGenerator ? this.dataStoreOptions.idGenerator() : id
      };
      console.log(docToSave)
      const request = collection.add(docToSave);

      request.onsuccess = () => {
        console.debug("inserted", docToSave);
        resolve(docToSave)
      };

      request.onerror = (event) => {
        console.log("error on insert", event);
        reject(event)
      };
    });
  }

  public async upsert<T>(doc: T, collectionName?: string): Promise<T> {}

  public async update<T>(doc: T, collectionName?: string): Promise<T> {}

  public async remove<T>(id: string, collectionName?: string): Promise<void> {}

  public async clearCollection(collectionName?: string): Promise<void> {

  }

  public async findAll(findOptions?: FindOptions<T>, collectionName?: string) {
    return new Promise(async (resolve, reject) => {
      const isDatabaseInvalidError = this.validateDatabaseExistence();
      if (isDatabaseInvalidError) {
        return reject(isDatabaseInvalidError)
      }
      
      const database = await this.openDatabase(this.databaseName);
      const transaction = this.setupTransaction(database, "readonly");

      const collection = this.getCollection(transaction, collectionName);

      const acc: T[] = [];

      collection.openCursor().onsuccess = (event: DbEvent<IDBCursorWithValue>) => {
        const cursor = event.target?.result;

        if (cursor) {
          if (findOptions?.where) {
            const keys = Object.keys(findOptions.where);
            
            const key = keys[0];
            const value = findOptions.where[key];
            
            if (cursor.value[key] === value) {
              acc.push(cursor.value);
              cursor.continue();
            } else {
              cursor.continue();
            }
          } else {
            acc.push(cursor.value);
            cursor.continue();
          }

        } else {
          resolve(acc);
        }
      }
    })
  }

  public async findOne<T>(findOptions: Record<string, unknown>, collectionName?: string): Promise<T & { id: string }> {
    return {}
  }
}

// async function main() {
//   const datastore = new DataStore("meudatabase", "exames");
//   console.log(await datastore.init());

//   await datastore.insert({ name: "Allan" });
// }

// main();
