namespace globalThis {
  type DbEvent<T> = {
    target: IDBRequest<T>
  }

  interface IDBVersionChangeEvent extends DbEvent<IDBDatabase> {
    target: IDBRequest<IDBDatabase>
  }

  interface IDBOpenDBRequest extends IDBRequest<IDBDatabase> {
    onsuccess: (this: IDBOpenDBRequest, ev: DbEvent<IDBDatabase>) => any
    onerror: (this: IDBOpenDBRequest, ev: Event) => any
  }

  // change cursor success event
  interface IDBCursorRequest {
    onsuccess: (this: IDBRequest<T>, ev: DbEvent<T>) => any
    onerror: (this: IDBRequest<T>, ev: Event) => any
  }

  interface IDBObjectStore extends IDBRequest<T> {
    openCursor(): IDBCursorRequest<T>
  }
}