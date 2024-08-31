declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATASTORE_COLLECTION_NAME: string;
      DATASTORE_DATABASE_NAME: string;
    }
  }
}

export {}