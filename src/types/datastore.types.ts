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
  $gt?: number
  $gte?: number
  $lt?: number
  $lte?: number
  $ne?: string
  $in?: (string | number)[]
  $nin?: string[]
  $regex?: RegExp | string
}

export type FindModifiersWithType<T> = {
  [K in keyof T | keyof FindModifiers]?: Record<keyof T, T[K extends keyof T ? K : never] | FindModifiers[K extends keyof FindModifiers ? K : never]>;
}

export type FindOptions<T> = {
  limit?: number
  offset?: number
  where?: FindModifiersWithType<T>
}

export type BaseResponse<T> = { [K in keyof T]: T[K] }
