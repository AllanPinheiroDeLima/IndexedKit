import { FindModifiers, FindOptions } from "./types/datastore.types";

enum FIND_MODIFIERS {
  $eq = "$eq",
  $gt = "$gt",
  $gte = "$gte",
  $lt = "$lt",
  $lte = "$lte",
  $ne = "$ne",
  $in = "$in",
  $nin = "$nin",
  $regex = "$regex"
}

export class SearchEngine {
  constructor() {
    console.info("Starting with the default search engine");
  }

  public filter<T extends {}>(filters: FindOptions<T>, currentValue: T) {
    if (!filters.where) return;

    const objectKeys = Object.keys(filters.where ?? {}) as FIND_MODIFIERS[];
    objectKeys.includes(FIND_MODIFIERS.$eq);
    
    for (const searchKey of objectKeys) {
      switch (searchKey) {
        case FIND_MODIFIERS.$eq:
          return this.filterEq(filters.where?.["$eq"], currentValue);
        // case FIND_MODIFIERS.$gt:
        //   return this.filterGt(filters.where);
        // case FIND_MODIFIERS.$gte:
        //   return this.filterGte(filters.where);
        // case FIND_MODIFIERS.$lt:
        //   return this.filterLt(filters.where);
        // case FIND_MODIFIERS.$lte:
        //   return this.filterLte(filters.where);
        // case FIND_MODIFIERS.$ne:
        //   return this.filterNe(filters.where);
        // case FIND_MODIFIERS.$in:
        //   return this.filterIn(filters.where);
        // case FIND_MODIFIERS.$nin:
        //   return this.filterNin(filters.where);
        // case FIND_MODIFIERS.$regex:
        //   return this.filterRegex(filters.where);
        default:
          return {}
          // return this.filterDefault(filters.where);
      }
    }

  }

  filterEq<T extends {}>(filters: T, currentValue: T) {
    const keys = Object.keys(filters) as (keyof T)[];
    return keys.every(key => filters[key] === currentValue[key]);
  }
}