namespace globalThis {
  type DbEvent<T> = {
    target: IDBRequest<T>
  }

  interface IDBVersionChangeEvent extends DbEvent<IDBDatabase> {
    target: IDBRequest<IDBDatabase>
  }

  interface IDBOpenDBRequest extends IDBRequest<IDBDatabase> {
    onsuccess: (this: IDBOpenDBRequest, ev: DbEvent<IDBDatabase>) => void;
    onerror: (this: IDBOpenDBRequest, ev: Event) => void;
  }

  // change cursor success event
  interface IDBCursorRequest<T> extends IDBRequest<T> {
    onsuccess: (this: IDBCursorRequest<T>, ev: DbEvent<T>) => void;
    onerror: (this: IDBCursorRequest<T>, ev: Event) => void;
  }

  interface IDBObjectStore<T> {
    // Define outros métodos conforme necessário
    add(value: T): IDBRequest<T>;
    put(value: T): IDBRequest<T>;
    delete(key: IDBValidKey): IDBRequest<void>;
    openCursor(): IDBCursorRequest<T>;
    get(key: IDBValidKey): IDBRequest<T>;
    getAll(): IDBRequest<T[]>;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATASTORE_COLLECTION_NAME: string;
      DATASTORE_DATABASE_NAME: string;
    }
  }
}

export {}