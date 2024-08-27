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
}