![example workflow](https://github.com/AllanPinheiroDeLima/indexedDBWrapper/actions/workflows/main.yml/badge.svg)

# IndexedKit

A simple and powerful wrapper for IndexedDB that simplifies data persistence in web applications. The `DataStore` class provides methods for CRUD operations, bulk inserts, and flexible querying capabilities.

## Features

- **CRUD Operations**: Easily create, read, update, and delete records.
- **Bulk Insert**: Insert multiple records in one go.
- **Flexible Queries**: Execute queries with conditions and offsets.
- **Custom ID Generation**: Supports custom ID generators.
- **Search Engine Integration**: Built-in search capabilities for field-based queries.

## Installation

You can install the `DataStore` library via npm:

```bash
npm install indexed-kit
```

## Usage

### Importing

First, import the `DataStore` class:

```typescript
import { DataStore } from "indexed-kit";
```

### Initialization

Create an instance of the `DataStore` by specifying the database name, collection name, and optional data store options.

```typescript
const dataStore = new DataStore<MyDataType>("myDatabase", "myCollection", {
    idKey: "id",
    indexes: [{ name: "nameIndex", keyPath: "name", unique: false }],
    idGenerator: () => "custom-id" // optional custom ID generator
});
```

### Initialization Method

Initialize the database. It is mandatory the call of this method, otherwise, the database will return an error:

```typescript
await dataStore.init();
```

### CRUD Operations

#### Insert

Insert a single record:

```typescript
const newUser = { name: "Alice", age: 30 };
await dataStore.insert(newUser);
```

#### Bulk Insert

Insert multiple records:

```typescript
const users = [
    { name: "Bob", age: 25 },
    { name: "Charlie", age: 35 },
];
await dataStore.bulkInsert(users);
```

#### Upsert

Insert or update a record. **important** if you are trying to update an existing record, this will shallow merge the existing record, overwriting any existing data with your new data:

```typescript
const userInDataBase = { id: "1", name: "Alice", age: 31, subFields: [] }

await dataStore.upsert({ id: "1", name: "Alice", age: 31 });

// When you try and find this record again, the subFields WILL be missing! Be warned!
```

#### Update

Update a record based on a query:

```typescript
await dataStore.update({ where: { name: "Alice" } }, { age: 32 });
```

#### Remove

Remove a record by ID:

```typescript
await dataStore.removeByIdKey("1");
```

#### Clear Collection

Clear all records from a collection:

```typescript
await dataStore.clearCollection();
```

### Querying

#### Find All

Retrieve all records with optional query parameters:

```typescript
const allUsers = await dataStore.findAll({ where: { age: 30 } });
```

#### Find One

Find a single record based on query parameters:

```typescript
const user = await dataStore.findOne({ where: { name: "Alice" } });
```

### Error Handling

The `DataStore` class throws specific errors for various scenarios:

- `DatabaseNotDefinedError`: Thrown when the database is not initialized.
- `InvalidInputError`: Thrown for invalid input data.
- `CollectionNotFoundError`: Thrown when the specified collection does not exist.
- `DocumentNotFoundError`: Thrown when the specified document is not found.

### License

This project is licensed under the MIT License.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
