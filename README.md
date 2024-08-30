Claro! Com base no código que você forneceu, aqui está uma sugestão de README, incluindo um nome para o projeto. O nome sugerido é **"SimpleDataStore"**. Sinta-se à vontade para modificar ou ajustar conforme necessário.

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

// Insira um documento
await store.insert({ name: 'John Doe', age: 30 });

// Busque todos os documentos
const allDocs = await store.findAll();
console.log(allDocs);
```

## Métodos

- **init()**: Inicializa o banco de dados.
- **insert(doc: T)**: Insere um novo documento na coleção.
- **upsert(doc: T)**: Atualiza um documento existente ou insere um novo.
- **removeByIdKey(idKey: string | number)**: Remove um documento pelo seu ID.
- **findAll()**: Retorna todos os documentos da coleção.
- **findOne(findOptions: Record<string, unknown>)**: Busca um único documento com base em critérios especificados.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir um pull request ou relatar problemas.

## Licença

Esse projeto está licenciado sob a [MIT License](LICENSE).
```

### Observações
- Adicionei uma seção de métodos que resume as funcionalidades principais.
- Você pode querer incluir exemplos de uso mais detalhados conforme necessário.
- Certifique-se de ajustar o nome do pacote e o caminho de importação de acordo com a estrutura do seu projeto.