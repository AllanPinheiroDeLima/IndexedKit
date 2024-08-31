import { BookSchema } from "../../tests/find/FindAll.spec"

export type IndexOpt = {
  name: string
  keyPath: string
  unique: boolean
}

export type DataStoreOptions<T> = {
  idGenerator?: (...args: any[]) => string
  idKey?: keyof T
  version?: number
  indexes?: Array<IndexOpt>
}

type SourceObj<T> = Partial<Record<keyof T, T[keyof T]>>
type SourceObjArr<T> = Partial<{
  [K in keyof T]: T[K][]
}>

type SourceObjRegex<T> = Partial<Record<keyof T, string | RegExp>>

export type FindModifiers<T> = {
  $gt: SourceObj<T>
  $gte: SourceObj<T>
  $lt: SourceObj<T>
  $lte: SourceObj<T>
  $ne: SourceObj<T>
  $in: SourceObjArr<T>
  $nin: SourceObjArr<T>
  $regex: SourceObjRegex<T>
  $and: Array<SourceObj<T>>
  $or: Array<SourceObj<T>>
}

export type FindModifiersWithType<T> = {
  [K in keyof T | keyof FindModifiers<T>]?: T[K extends keyof T ? K : never] | FindModifiers<T>[K extends keyof FindModifiers<T> ? K : never]
}

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type FindOptions<T> = {
  limit?: number
  offset?: number
  where?: FindModifiersWithType<T>
}

export type BaseResponse<T> = { [K in keyof T]: T[K] }
