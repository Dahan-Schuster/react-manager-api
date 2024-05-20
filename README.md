# Projeto Padrão

Um ponto inicial para APIs RESTFUL feito com Nodejs, AdonisJse Lucid. Inclui rotas CRUD para usuários, perfis, temas e permissões; Log de operações no banco de dados e no stdout; pré-configuração para envio de e-mails e mais.

## Conteúdo

- [Projeto Padrão](#projeto-padrão)
  - [Conteúdo](#conteúdo)
  - [Instalação](#instalação)
    - [Preparação do ambiente](#preparação-do-ambiente)
  - [Configurações próprias do projeto](#configurações-próprias-do-projeto)
    - [Módulos e Tipos de permissão do sistema](#módulos-e-tipos-de-permissão-do-sistema)
    - [Seeders](#seeders)
      - [001\_Modulos](#001_modulos)
      - [002\_Perfis](#002_perfis)
      - [003\_TiposPermissao](#003_tipospermissao)
      - [004\_PermissoesModulos:](#004_permissoesmodulos)
      - [005\_UsuarioAdmin](#005_usuarioadmin)
      - [006\_PermissoesAdmin](#006_permissoesadmin)
      - [007\_ItensMenu](#007_itensmenu)
      - [Editando os seeders](#editando-os-seeders)
    - [Temas](#temas)
  - [Desenvolvimento](#desenvolvimento)
    - [Tabelas e models](#tabelas-e-models)
      - [Auto-Preload](#auto-preload)
    - [Criando módulos e permissões](#criando-módulos-e-permissões)
    - [Controllers e rotas](#controllers-e-rotas)
      - [Resposta da requisição](#resposta-da-requisição)
      - [Exemplo de controller](#exemplo-de-controller)
    - [Logs](#logs)
    - [Eventos](#eventos)
    - [Tratamento de erros](#tratamento-de-erros)

## Instalação

Para usar o template, clone o projeto e a remote primária:

```bash
  # aqui você pode passar o nome da pasta que desejar, para atender sua necessidade
  git clone git@bitbucket.org:padrao-paineis-web-quaestum/api-projeto.git
  git remote remove origin
```

Isso irá clonar o projeto na branch principal, e depois remover a remote origin para poder adicionar a URL do seu repositório:

**ATENÇÃO:** Dê preferência a criar o repositório sem commits automáticos (como arquivos .gitignore ou READMEs) que são criados junto do repositório. Isso irá descomplicar o passo de fazer push dos commits do projeto padrão no

```bash
  cd api-projeto
  git init
  git remote add origin <URL_REPOSITORIO_API_SEU_PROJETO>
  git push origin main
```

Opcionalmente, você pode adicionar o repositório do Projeto Padrão como uma remote secundária, para poder atualizar seu projeto quando houverem novas funcionalidades no Padrão:

```bash
  # isso irá adicionar a remote de nome "padrao":
  git remote add padrao git@bitbucket.org:padrao-paineis-web-quaestum/api-projeto.git

  # para usá-la, basta usar "padrao" ao invés de "origin" ao fazer pull:
  git pull padrao main

```

Remotes são URLs para repositórios de onde se pode fazer `pull` ou `push` do código local. A remote "origin" é a primária e deve apontar para seu projeto.

    Cuidado! A depender do quão diferente estiver o seu projeto do Projeto Padrão, fazer
    um pull da remote "padrao" pode gerar conflitos. É recomendável mover para uma nova
    branch antes de fazer o pull, e usar a opção --rebase

### Preparação do ambiente

Como parte da instalação, é necessário preparar o ambiente de desenvolvimento seguindo estes passos:

1. Configurar arquivo .env de acordo com o .env.example, definindo os dados de acesso do banco de dados, do envio de e-mails e outras informações como o nome do projeto

2. Instalar as dependências usando yarn
   - Usamos Yarn como padrão para gerencias dependências no projeto. Usar NPM em conjunto pode gerar em inconsistências.

```bash
    # execute o commando abaixo se o yarn não estiver instalado
    npm install -g yarn

    # mudar para a pasta do projeto
    cd api-projeto

    # instalar dependências listadas no package.json
    yarn
```

3. Executar as migrations do banco de dados
   - Parte da instalação envolve atualizar o banco com as inclusões e alterações nas tabelas

```bash
  node ace migration:run
```

4. Opcionalmente, você pode importar os arquivos Postman inclusos na raiz do projeto. Eles contém as variáveis de ambiente e as requisições necessárias para testar cada rota da API sem a necessidade de usar a interface do Frontend. Geralmente novas rotas são testadas no Postman antes de serem inclusas, então verifique por alterações nesses arquivos: [Projeto Padrão.postman_collection.json](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/Projeto%20Padrão.postman_collection.json) e [Projeto Padrão DEV.postman_environment.json](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/Projeto%20Padrão%20DEV.postman_environment.json)

## Configurações próprias do projeto

Cada projeto terá sua série de módulos, perfis, tipos de permissões, temas e itens de menu. Os seeders do Projeto Padrão vêm com uma configuração inicial que pode ser usada sem alterações.
Para executar os seeders, execute o seguinte comando na pasta do projeto:

```bash
# irá executar os seeders da pata ./database/seeders em ordem alfabética
# a opção --interactive pode ser passada para escolher quais seeders executar
node ace db:seed
```

Se o seu projeto possuir necessidades específicas de módulos, perfis, tipos de permissão ou itens de menu, basta alterar os seeders existentes.
Antes de alterar, é recomendável ler sobre como funcionam cada um desses módulos na seção abaixo.

### Módulos e Tipos de permissão do sistema

Os tipos de permissão (tabela tipos_permissoes) guardam as ações possíveis no sistema. As mais básicas são as operações CRUD: Criar, Listar, Editar e Deletar. O Projeto Padrão também traz duas outras permissões: Alterar Status (para tabelas que contém a coluna `ativo` ou semelhante) e Alterar Permissões (para tabelas que incluem permissões por item, como Usuários)

Módulos (tabela modulos) no sistema são grupos de funcionalidades, geralmente para uma única tabela. São usados para criar links com os tipos de permissão, formando uma permissão específica para um módulo, como por exemplo Listar Usuários (tipo Listar no módulo Usuários).

A tabela permissoes guarda as relações many-to-many entre Módulos e Tipos de Permissão. Adicionalmente, as colunas `label` e `slug` salvam como essas permissões são identificadas.

    Atenção para a coluna slug: toda a verificação de permissões no sistema depende dessa coluna.
    Ela permite identificar a permissão de forma humana rapidamente, e é montada no formato:
    [NOME_MODULO]_[NOME_TIPO_PERMISSAO], sem acentos, letras maiúsculas e espaços.
    Ex.: usuarios-criar, perfis-listar, temas-deletar

A configuração de permissões por módulo é feita no Seeder [004_PermissoesModulos](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/database/seeders/004_PermissoesModulos.ts). Mais sobre isso na sessão [Seeders](#seeders).

A tabela de permissões possui outra coluna extra chamada `permissao_fixada`. Ela é usada para configurar as permissões de usuários e informa se a permissão foi herdada por um perfil (`permissao_fixada = 0`) ou dada diretamente ao usuário (`permissao_fixada = 1`).

Isto impacta a definição de permissões do usuário no momento em que o mesmo troca de perfil (ou quando o perfil tem suas permissões alteradas). Por exemplo, se houver um perfil Gerente com a única permissão de Listar Usuários e um novo usuário for registrado com este perfil, ele irá herdar esta permissão. Caso em algum momento a permissão seja fixada para o usuário (através da tab de permissões no formulário de usuário no Projeto Padrão Web, por exemplo), mesmo que o usuário deixe de ter o perfil Gerente a permissão continuará ativa para ele. O mesmo vale para caso a permissão seja removida do perfil, o que impacta todos os usuários associados ao perfil imediatamente, removendo ou adicionando permissões.

Esta configuração pode ser deixada transparente a depender do projeto. Se seu projeto não precisa adicionar/remover permissões por usuário, o sistema de perfis será suficiente. Lembre-se apenas de ajustar o frontend, caso use o Projeto Padrão Web, para não mostrar o formulário de permissões do usuário, apenas o select de perfil, e use o formulário de permissões dos perfis.

### Seeders

#### [001_Modulos](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/database/seeders/001_Modulos.ts)

Este seeder salva no banco os seguintes módulos principais do sistema:

1. Perfis (CRUD de perfis e alteração de suas permissões)
2. Usuários (CRUD de usuários, ativação e inativação de conta e alteração de permissões próprias do usuário)
3. Temas (CRUD de temas e alteração dos temas ativos)
4. Itens Menu (CRUD de itens do menu e alteração dos itens ativos)
5. Logs (listagem de logs)

#### [002_Perfis](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/database/seeders/002_Perfis.ts)

Este seeder cria os perfis iniciais do sistema. Atualmente apenas o Admin é criado,
porém sem permissões pré-definidas.

#### [003_TiposPermissao](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/database/seeders/003_TiposPermissao.ts) 

Este seeder salva os seguintes tipos básicos:

1. Listar
2. Criar
3. Editar
4. Deletar
5. Alterar status
6. Alterar Permissão

#### [004_PermissoesModulos](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/database/seeders/004_PermissoesModulos.ts):

Este seeder é responsável por criar as permissões de cada módulo e informar seu Slug e Label.

A configuração é feita manualmente, sem usar rotas na API, pois os slugs aqui configurados são replicados tanto no front quanto no back para programar as permissões de forma legível, sem depender de IDs.

Por exemplo, ao configurar a seguinte permissão:

```json
{
  tipoId: tipoListar.id,
  moduloId: moduloPerfis.id,
  label: "Listar perfis",
  slug: "perfis-listar",
}
```

é possível informar a permissão da rota GET /perfis usando o slug perfis-listar:

```typescript
Route.get("/", "Perfis/GetPerfisController").middleware("auth:perfis-listar");
```

e verificar pela permissão no frontend usando o método `has` do hook `useUserPermissions` incluso no [Projeto Padrão Web](https://bitbucket.org/padrao-paineis-web-quaestum/front-projeto/src/main/):

```jsx
const { has } = useUserPermissions();

if (!has('perfis-listar')) return null;
return (
  // ... listagem de perfis
)
```

Por baixo dos panos, tanto o Front quanto o Back estão buscando na lista de permissões do usuário logado alguma permissão cujo slug é igual ao informado. Mais sobre isso será explicado na sessão [Desenvolvimento](#desenvolvimento).

Por fim, o seeder `004_PermissoesModulos` cadastra uma série de permissões para cada um dos módulos criados no seeder `001_Modulos`

A tabela de permissões possui outra coluna extra chamada `permissao_fixada`. Ela é usada para configurar as permissões de usuários e informa se a permissão foi herdada por um perfil (`permissao_fixada = 0`) ou dada diretamente ao usuário (`permissao_fixada = 1`).

Isto impacta a definição de permissões do usuário no momento em que o mesmo troca de perfil (ou quando o perfil tem suas permissões alteradas). Por exemplo, se houver um perfil Gerente com a única permissão de Listar Usuários e um novo usuário for registrado com este perfil, ele irá herdar esta permissão. Caso em algum momento a permissão seja fixada para o usuário (através da tab de permissões do usuário no Projeto Padrão Web, por exemplo), mesmo que o usuário deixe de ter o perfil Gerente a permissão continuará ativa para ele. O mesmo vale para caso a permissão seja removida do perfil, o que impacta todos os usuários associados ao perfil imediatamente, removendo ou adicionando permissões.

#### [005_UsuarioAdmin](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/database/seeders/005_UsuarioAdmin.ts)

Este seeder cria um usuário admin master com email e senha padrões. Este pode ser alterado para o email e senha que preferir:

```json
{
  nome: "Admin",
  email: "admin@teste.com.br",
  password: "padrao@123",
}
```

#### [006_PermissoesAdmin](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/database/seeders/006_PermissoesAdmin.ts)

Este seeder dá permissões para todos os módulos cadastrados no seeder `001_Modulos` ao usuário Admin. Note que estas permissões são salvas com a coluna `permissao_fixada = 1`, ou seja, este usuário não precisa de um perfil. As permissões são adicionadas diretamente e permanecerão mesmo que ele seja associado a um perfil.

    Note que, se você alterou o email do usuário Admin no seeder anterior, deverá ajustar
    neste seeder, pois é pelo email que o usuário é buscado no banco.

#### [007_ItensMenu](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/database/seeders/007_ItensMenu.ts)

Este seeder  cadastra os itens de menu padrão do sistema, configurados com permissões necessárias para poderem ser visualizados no frontend.

#### Editando os seeders

Cada um dos seeders pode ser alterado para atender os requisitos do seu projeto. Para adicionar novos itens à tabela Módulos, Tipos de Permissão etc, basta alterar o seeder e executá-lo separadamente com:

```bash
node ace db:seed --files="database/seeder/<NOME DO SEEDER>"
```

Veja mais sobre o método [fetchOrCreateMany](https://v5-docs.adonisjs.com/reference/orm/base-model#static-fetchorcreatemany) usado nos seeders para poder executar o mesmo seeder múltiplas vezes sem recadastrar itens já cadastrados.

### Temas

Temas são conjuntos de cores e imagens de logo usadas no sistema. É recomendável que tenham sempre um tema ativo para cada modo: claro e escuro.

A tela de temas do Projeto Padrão WEB fornece uma interface intuitiva para criação do tema, com um painel de previsualização dos componentes mais comuns.

Assume-se que a biblioteca usada para aplicação do tema é a MUI, usada no Projeto Padrão WEB, mas é possível criar outra configuração de temas. Por isso
a nomeclatura dos temas na api é "Temas MUI", para diferenciar de eventuais novas implementações.

## Desenvolvimento

Para começar a desenvolver o sistema, certifique-se de ter passado pelos passos da [instalação](#instalação) e prossiga para iniciar um servidor de desenvolvimento no terminal:

```bash
# navega para a pasta do projeto
cd api-projeto

# inicie o sistema em modo de dev
yarn dev
```

Se não ocorrer nenhum erro, prossiga para testar o login e outras rotas na API usando um cliente frontend ou o Postman.

    Se não rodou o seeder de usuário admin padrão, crie um usuário diretamente pelo banco.
    Porém é recomendado usar ao menos o seeder 006_PermissoesAdmin, para que as permissões
    necessárias para usar as rotas de configuração do sistema sejam adicionadas.
    Lembre de usar o mesmo email do usuário criado.

A API é feita usando [AdonisJS 5](https://v5-docs.adonisjs.com/guides/introduction), usando a própria biblioteca [lucid](https://lucid.adonisjs.com/docs/introduction) (também do AdonisJs) como ORM.

### Tabelas e models

O fluxo de criação de uma nova tabela e seu model é o seguinte:

```
node ace make:migration <NOME TABELA>

node ace make:model <NOME MODEL>
```
Na migration você define os campos da tabela, e o model é a representação do objeto no Typescript. Nele você também define as relações entre outros Objetos, com os decorators @hasOne, @hasMany, @manyToMany etc.

Se o nome do model não corresponder ao nome da tabela no singular (ex: tabela usuarios, model Usuario), você pode informar ao Adonis qual o nome da tabela usando a propriedade `table`:

```typescript
// nesse caso, o adonis buscaria por uma tabela chamada "menu_items", com "m",
// pois o inglês é usado como padrão
class MenuItem extends BaseModel {
  public static table = "menu_itens";

  // ...
}
```

Mais informações sobre o ORM [aqui](https://v5-docs.adonisjs.com/guides/models/introduction)

Tabelas de relação Many To Many geralmente não possuem um model associado (a tabela permissoes é uma exceção à regra). Basta adicionar a o decorator @manyToMany nas duas tabelas relacionadas.

Alguns métodos podem ser adicionados ao Model para encapsular a lógica e poder reutilizar dentro de outros métodos (controllers, por exemplo). Isso pode ser feito criando um método público no model ou usando os hooks do Adonis: @beforeSave, @afterSave, etc.

```typescript
  @beforeSave()
  public static async hashToken(token: RecoveryToken) {
    if (token.$dirty.token) {
      token.token = await Hash.make(token.token);
    }
  }
```

O decorator @column é usado para definir as propriedades do model que representam colunas na tabela. Nele é possível configurar como a propriedade será retornada quando transformar o objeto em JSON, usando a opção `serialize`. Por exemplo, campos boolean no banco de dados são salvos como 0 ou 1. No model, é recomendável transformar o valor para evitar inconsistências de tipo:

```typescript
  @column({ serialize: (value) => Boolean(value) })
  public ativo: boolean;
```

#### Auto-Preload

Adicionalmente, este projeto usa a extensão [Adonis Auto-Preload](https://github.com/Melchyore/adonis-auto-preload) para carregar relações de objetos automaticamente.

Caso não esteja familiarizado, leia sobre como definir e carregar relações [aqui](https://v5-docs.adonisjs.com/guides/models/relationships) e [aqui](https://v5-docs.adonisjs.com/guides/models/relationships#preload-relationship).

Para carregar as relações automaticamente, ajuste o model para ser uma composição das classes `BaseModel` e `AutoPreload` e adicione a propriedade estática `$with`, contendo um array com o nome de cada relação a ser carregada (necessário definir a relação no model):

```typescript
import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { compose } from "@ioc:Adonis/Core/Helpers";
import { AutoPreload } from "@ioc:Adonis/Addons/AutoPreload";

class MenuItem extends compose(BaseModel, AutoPreload) {
  public static table = "menu_itens";

  // array de relações a serem carregadas automaticamente:
  public static $with = ["children"] as const;

  @column()
  public parent_id: number | null;

  @hasMany(() => MenuItem, {
    foreignKey: "parent_id",
  })
  public children: HasMany<typeof MenuItem>; // definição da relação
}
```

Mais opções de autocarregamento podem ser vistas na página da extensão.

### Criando módulos e permissões

Geralmente, uma nova tabela estará relacionada a um módulo do sistema, que conterá 
permissões de acesso, como é o caso das tabelas users, perfis e temas_mui_sistema.

Nesse caso, basta adicionar o nome do módulo no seeder 001_Modulos:

```typescript
await Modulo.fetchOrCreateMany("nome", [
  { nome: "Perfis" },
  // ...
  { nome: "Vendas" } // adicionar
]);
```
Caso precise de tipos de permissão específicos para uma ação, como por exemplo exportar arquivos, crie o tipo no seeder 003_TiposPermissao:

```typescript
await TipoPermissao.fetchOrCreateMany("nome", [
  { nome: "Listar" },
  // ...
  { nome: "Exportar" }, // adicionar
]);
```

e configurar quais tipos de permissão existem para esse módulo no seeder 004_PermissoesModulos:

```json
  // Vendas
  {
    tipoId: tipoListar.id,
    moduloId: moduloVendas.id,
    label: "Listar vendas",
    slug: "vendas-listar",
  },
  {
    tipoId: tipoExportar.id,
    moduloId: moduloVendas.id,
    label: "Exportar vendas",
    slug: "vendas-exportar",
  },
```


Ao fazer isso, será possível limitar o acesso a esse módulo usando as permissões 
criadas, tanto no controller quanto nos frontends, pois o controller de login retorna um array de permissões do usuário no formato:

```json
"user": {
  // ...
  "permissoes": [
    {
        "id": 2,
        "label": "Listar perfis",
        "tipo_id": 1,
        "modulo_id": 1,
        "created_at": "2024-04-29T13:37:34.000-03:00",
        "updated_at": "2024-04-29T13:37:34.000-03:00",
        "slug": "perfis-listar"
    },
    // ...
  ]
}
```

O backend implementa um [middleware](https://v5-docs.adonisjs.com/guides/middleware) de autenticação que pode receber uma lista de slugs de permissão seperados por vírgula (ex: perfis-listar,usuarios-listar). O que este middleware faz é carregar as permissões do usuário logado usando o `preload` do lucid e verificar se algum dos slugs informados está incluso nas permissões:

```typescript
// app/Middleware/Auth
// ...
if (permissoes?.length) {
  const user = auth.user!;
  await user.load("permissoes");
  if (!user.permissoes.some((p) => permissoes.includes(p.slug))) {
    throw new ApiError("Acesso negado", 403);
  }
}
// ...
```

### Controllers e rotas

Controllers recebem e validam as requisições. Podem realizar uma consulta simples no banco ou chamar métodos com lógica mais complexa no model. Usamos o padrão de [Single Action Controller](https://docs.adonisjs.com/guides/basics/controllers#single-action-controllers), com um único método `handle` por controller, que fará uma única ação.

Para criar um controller, use o comando:

```typescript
node ace make:controller NovoController
```

Depois adicione a rota à API. Você pode usar um arquivo de rotas existente em `./start/routes.ts` ou adicionar um novo arquivo na pasta `./start/routes/` e importá-lo no `routes.ts`:

```typescript
// start/routes/vendas.ts

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", "Vendas/GetVendasController").middleware("auth:vendas-listar");
  Route.post("/exportar", "Vendas/ExportarVendasController").middleware(
    "auth:vendas-exportar"
  );
}).prefix("vendas");
```

```typescript
// start/routes.ts

// ...
import "./routes/vendas";
```

Note que em cada rota é adicionado o middleware `auth`, passando como parâmetro depois do `:` a lista de permissões necessárias para acessar a rota, no formato de string com os slugs separados por vírgulas: `auth:permissao-1,permissao-2,permissao-3`. Note que a lógica usada é OU, ou seja, o usuário deverá ter ao menos UMA das permissões para acessar.

Geralmente apenas uma permissão é passada por rota, mas sinta-se livre para passar quantas precisar para seu caso de uso.

Se não quiser definir permissões para a rota, mas ainda quiser bloquear a mesma para apenas usuários logados, inclua o middleware `auth` sem parâmetros: `.middleware('auth')`.

#### Resposta da requisição

Por padrão, retornamos todas as requisições com um objeto no formato

```json
{
  success: boolean;
  error: string | undefined;
  objeto: any; // variável a depender do controller
}
```

#### Exemplo de controller

```typescript
export default class GetPerfisController {
  public async handle({ response, logger }: HttpContextContract) {
    logger.info('Buscando perfis')
    const perfis = await Perfil.query().orderBy("nome", "asc");
    response.send({
      success: true,
      perfis,
    });
  }
}
```

### Logs

Mais sobre o logger do AdonisJS [aqui](https://v5-docs.adonisjs.com/guides/logger).

EVITE usar console.log, pois este imprime apenas a mensagem passada. Caso queira deixar logs no servidor para um determinado tipo de ação, use o objeto `logger` incluso no contexto da requisição (ou importe a classe Logger diretamente se não estiver no contexto de requisições).

```typescript
export default class GetPerfisController {
  public async handle({ response, logger }: HttpContextContract) {
    logger.info('Sou uma mensagem de log!')
    logger.error('Sou uma mensagem de erro!')
    logger.warn('Sou uma mensagem de aviso!')
    // ...
  }
}
```

A vantagem disso é ter o horário de cada log e poder diferenciar mensagens de informação, erro, aviso etc. Além disso, a API está configurada para gerar um ID único para cada requisição, então todos os logs feitos usando o objeto logger da mesma requisição terão o `requestId` impresso em conjunto, o que facilita a investigação de erros futuros.

### Eventos

Leia mais sobre a documentação de eventos no AdonisJS [aqui](https://v5-docs.adonisjs.com/guides/events).

Nomes de eventos podem ser registrados no arquivo `./contracts/events.ts` na interface `EventsList`. As chaves dessa interface definem quais eventos podem ser lançados e escutados, enquanto o valor de cada chave informa o tipo esperado de dados que devem ser recebidos pelo listener desse evento.

Novos listeners devem ser registrados no arquivo `./start/events.ts`, semelhante a como é feito no arquivo de rotas. Neste arquivo definem-se os listeners de cada tipo de evento.

Para criar um novo listener, use o comando:

```bash
node ace make:listener NovoListener
```

No arquivo criado, é possível definir vários métodos. Esse métodos são associados ao evento no arquivo de `./start/events.ts` no formato `Event.on("new:evento", "NovoListener.metodo");`. Cada um deve receber como parâmetro o tipo informato em `./contracts/events.ts`

Um caso de uso comum para eventos é o salvamento de logs no banco de dados. Como os eventos do Adonis são assíncronos, a requisição não fica travada esperando todos os listeners terminarem. Para salvar um log no banco, basta usar a tabela DatabaseLog:

```typescript
// app/Listeners/User.ts

import type { EventsList } from "@ioc:Adonis/Core/Event";
import DatabaseLog from "App/Models/DatabaseLog";

export default class User {
  public async onNewUser({
    user,
    origem,
    observacoes,
    ctx,
  }: EventsList["new:user"]) {
    ctx.logger.info(`Novo usuário criado: #${user.id} - ${user.email}`);
    const databaseLog = new DatabaseLog();

    const requestId = ctx.request.header("x-request-id");

    databaseLog
      .fill({
        operacao: "new",
        modulo: "user",
        origem,
        dados: JSON.stringify(user),
        user_id: ctx.auth?.user?.id,
        observacoes,
        request_id: requestId,
      })
      .save();
  }
}
```

### Tratamento de erros

Saiba mais sobre tratamento de erros no AdonisJS [aqui](https://v5-docs.adonisjs.com/guides/exception-handling#handling-exceptions-globally)

A classe `app/Exceptions/Handler` é responsável por tratar as exeções lançadas globalmente pela API. Por isso, não use try-catch a menos que queira capturar erros específicos do seu caso de uso. Nos demais casos, deixe que a operação lance erros sem capturá-los. É possível adicionar códigos de erros conhecidos no objeto `ErrorResponsesByCode` definido dentro da classe (ex: 'E_ROUTE_NOT_FOUND', 'E_VALIDATION_FAILURE'). Verifique a classe para saber mais como os erros são formatados e enviados de volta para a requisição.