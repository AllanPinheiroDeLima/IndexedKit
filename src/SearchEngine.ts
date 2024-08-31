import { BookSchema } from "../tests/find/FindAll.spec";
import { FindModifiers, FindModifiersWithType, FindOptions } from "./types/datastore.types";

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

export class SearchEngine<T extends {}> {
  constructor() {
    console.info("Starting with the default search engine");
  }

  filterEq(filters: T, currentValue: T) {
    const keys = Object.keys(filters) as (keyof T)[];
    return keys.every(key => filters[key] === currentValue[key]);
  }

  filterNe(filters: T, currentValue: T) {
    const keys = Object.keys(filters) as (keyof T)[];
    return keys.every(key => filters[key] !== currentValue[key]);
  }

  filterGt(filters: T, currentValue: T) {
    const keys = Object.keys(filters) as (keyof T)[];
    return keys.some(key => currentValue[key] > filters[key]);
  }

  filterLt(filters: T, currentValue: T) {
    const keys = Object.keys(filters) as (keyof T)[];
    return keys.some(key => currentValue[key] < filters[key]);
  }

  filterGte(filters: T, currentValue: T) {
    const keys = Object.keys(filters) as (keyof T)[];
    return keys.some(key => currentValue[key] >= filters[key]);
  }

  filterLte(filters: T, currentValue: T) {
    const keys = Object.keys(filters) as (keyof T)[];
    return keys.some(key => currentValue[key] <= filters[key]);
  }

  filterRegex(filters: T, currentValue: T) {
    const keys = Object.keys(filters) as (keyof T)[];
    
    return keys.some(key => {
      let regexPattern: string | RegExp = "";
      if (filters[key] instanceof RegExp) {
        regexPattern = filters[key];
      } else {
        regexPattern = filters[key] as string;
      }

      const regex = new RegExp(regexPattern);
      return regex.test(currentValue[key] as string);
    });
  }

  filterIn(filters: Record<keyof T, unknown[]>, currentValue: T) {
    const keys = Object.keys(filters) as (keyof T)[];
    return keys.some(key => filters[key].includes(currentValue[key]));
  }

  filterNin(filters: Record<keyof T, unknown[]>, currentValue: T) {
    const keys = Object.keys(filters) as (keyof T)[];
    return keys.every(key => !filters[key].includes(currentValue[key]));
  }

  exec(whereOpts: FindModifiersWithType<T>, currentValue: T) {
    const objectKeys = Object.keys(whereOpts);
    
    const assertions = [];

    for (const searchKey of objectKeys) {
      switch (searchKey) {
        case FIND_MODIFIERS.$eq:
          assertions.push(this.filterEq(whereOpts.$eq!, currentValue));
          break;
        case FIND_MODIFIERS.$gt:
          assertions.push(this.filterGt(whereOpts.$gt!, currentValue));
          break;
        case FIND_MODIFIERS.$gte:
          assertions.push(this.filterGte(whereOpts.$gte!, currentValue));
          break;
        case FIND_MODIFIERS.$lt:
          assertions.push(this.filterLt(whereOpts.$lt!, currentValue));
          break
        case FIND_MODIFIERS.$lte:
          assertions.push(this.filterLte(whereOpts.$lte!, currentValue));
          break;
        case FIND_MODIFIERS.$ne:
          assertions.push(this.filterNe(whereOpts.$ne, currentValue));
          break
        case FIND_MODIFIERS.$in:
          assertions.push(this.filterIn(whereOpts.$in, currentValue));
          break
        case FIND_MODIFIERS.$nin:
          assertions.push(this.filterNin(whereOpts.$nin, currentValue));
          break
        case FIND_MODIFIERS.$regex:
          assertions.push(this.filterRegex(whereOpts.$regex!, currentValue));
          break
        default:
          assertions.push(this.filterEq(whereOpts, currentValue));
          break;
      }
    }

    return assertions.every(assertion => assertion);
  }
}