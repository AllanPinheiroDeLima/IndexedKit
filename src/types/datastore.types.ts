export type IndexOpt = {
  name: string
  keyPath: string
  unique: boolean
}

export type DataStoreOptions = {
  idGenerator?: (...args: any[]) => string
  idKey?: string
  version?: number
  indexes?: Array<IndexOpt>
}

export type FindModifiers = {
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

export type FindModifiersWithType<T> = {
  [K in keyof T]?: FindModifiers | T[K];
}

export type FindOptions<T> = {
  limit?: number
  offset?: number
  where?: FindModifiersWithType<T>
}

export type BaseResponse<T> = { [K in keyof T]: T[K] }
