![example workflow](https://github.com/AllanPinheiroDeLima/indexedDBWrapper/actions/workflows/main.yml/badge.svg)

```markdown
# SimpleDataStore

Um repositório simples para gerenciar um armazenamento de dados utilizando IndexedDB em aplicações web. O `DataStore` oferece uma interface para manipulação de dados de forma assíncrona, permitindo operações como inserção, atualização, busca e remoção de documentos.

## Descrição

`SimpleDataStore` é uma classe TypeScript que encapsula a funcionalidade do IndexedDB, permitindo que você armazene e recupere dados de maneira eficiente e organizada. A classe oferece métodos para inserir, atualizar, buscar e remover dados, além de garantir a validação de entrada.

## Instalação

Para usar o `SimpleDataStore`, você pode simplesmente importar a classe em seu projeto:

```bash
npm install simple-data-store
```

## Uso

Aqui está um exemplo de como usar o `DataStore`:

```typescript
import { DataStore } from 'simple-data-store';

// Crie uma nova instância do DataStore
const store = new DataStore('myDatabase', 'myCollection');

// Inicialize o banco de dados
await store.init();
```

## Métodos

### `init()`
Inicializa o banco de dados. **É obrigatório chamar este método antes de qualquer outra operação**.

```typescript
await store.init(); // Inicializa o banco de dados
```

### `insert(doc: T)`
Insere um novo documento na coleção.

```typescript
const newDoc = { name: 'John Doe', age: 30 };
const insertedDoc = await store.insert(newDoc);
console.log('Documento inserido:', insertedDoc);
```

### `upsert(doc: T, findOptions: FindOptions<T>)`
Atualiza um documento existente ou insere um novo se ele não existir.

```typescript
const updatedDoc = { id: '1', name: 'John Doe', age: 31 };
const upsertedDoc = await store.upsert(updatedDoc, { where: { id: '1' } });
console.log('Documento atualizado ou inserido:', upsertedDoc);
```

### `removeByIdKey(idKey: string | number)`
Remove um documento pelo seu ID.

```typescript
const idToRemove = '1';
await store.removeByIdKey(idToRemove);
console.log(`Documento com ID ${idToRemove} removido com sucesso.`);
```

### `findAll(findOptions?: FindOptions<T>)`
Retorna todos os documentos da coleção.

```typescript
const allDocs = await store.findAll();
console.log('Todos os documentos:', allDocs);
```

### `findOne(findOptions: Record<string, unknown>)`
Busca um único documento com base em critérios especificados.

```typescript
const foundDoc = await store.findOne({ where: { name: 'John Doe' } });
console.log('Documento encontrado:', foundDoc);
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir um pull request ou relatar problemas.

## Licença

Esse projeto está licenciado sob a [MIT License](LICENSE).
```