
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

## Instalação

Para usar o template, clone o projeto e apague o histórico GIT:

```bash
  # aqui você pode passar o nome da pasta que desejar, para atender sua necessidade
  git clone --depth=1 git@bitbucket.org:padrao-paineis-web-quaestum/api-projeto.git
  rm -rf api-projeto/.git
```

Isso irá clonar o projeto na branch principal, e depois remover a pasta .git para permitir inicializar um novo repositório para o seu projeto:

```bash
  cd api-projeto
  git init
  git add .
  git commit -m "Primeiro commit"
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

Cada projeto terá sua série de módulos, perfis, tipos de permissões e itens de menu. Os seeder do Projeto Padrão vêm com uma configuração inicial que pode ser usada sem alterações.
Para executar os seeders, execute o seguinte comando na pasta do projeto:

```bash
# irá executar os seeders da pata ./database/seeders em ordem alfabética
node ace db:seed
```

Se o seu projeto possuir necessidades específicas de módulos, perfis, tipos de permissão ou itens de menu, basta alterar os seeders existentes.
Antes de alterar, é recomendável ler sobre como funcionam cada um desses módulos.

### Módulos e Tipos de permissão do sistema

Os tipos de permissão (tabela tipos_permissoes) guardam as ações possíveis no sistema. As mais básicas são as operações CRUD: Criar, Listar, Editar e Deletar. O Projeto Padrão também traz duas outras permissões: Alterar Status (para tabelas que contém a coluna `ativo` ou semelhante) e Alterar Permissões (para tabelas que incluem permissões por item, como Usuários)

Módulos (tabela modulos) no sistema são grupos de funcionalidades, geralmente para uma única tabela. São usados para criar links com os tipos de permissão, formando uma permissão específica para um módulo, como por exemplo Listar Usuários (tipo Listar no módulo Usuários).

A tabela permissoes guarda as relações many-to-many entre Módulos e Tipos de Permissão. Adicionalmente, as colunas `label` e `slug` salvam como essas permissões são identificadas.

    Atenção para a coluna slug: toda a verificação de permissões no sistema depende dessa coluna.
    Ela permite identificar a permissão de forma humana rapidamente, e é montada no formato:
    [NOME_MODULO]_[NOME_TIPO_PERMISSAO], sem acentos, letras maiúsculas e espaços.
    Ex.: usuarios-criar, perfis-listar, deletar-temas

A configuração de permissões por módulo é feita no Seeder [004_PermissoesModulos](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/database/seeders/004_PermissoesModulos.ts). Mais sobre isso na sessão [Seeders](#seeders).

A tabela de permissões possui outra coluna extra chamada `permissao_fixada`. Ela é usada para configurar as permissões de usuários e informa se a permissão foi herdada por um perfil (`permissao_fixada = 0`) ou dada diretamente ao usuário (`permissao_fixada = 1`).

Isto impacta a definição de permissões do usuário no momento em que o mesmo troca de perfil (ou quando o perfil tem suas permissões alteradas). Por exemplo, se houver um perfil Gerente com a única permissão de Listar Usuários e um novo usuário for registrado com este perfil, ele irá herdar esta permissão. Caso em algum momento a permissão seja fixada para o usuário (através da tab de permissões do usuário no Projeto Padrão Web, por exemplo), mesmo que o usuário deixe de ter o perfil Gerente a permissão continuará ativa para ele. O mesmo vale para caso a permissão seja removida do perfil, o que impacta todos os usuários associados ao perfil imediatamente, removendo ou adicionando permissões.

### Seeders

O seeder [001_Modulos](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/database/seeders/001_Modulos.ts) salva no banco os seguintes módulos principais do sistema:

  1. Perfis (CRUD de perfis e alteração de suas permissões)
  2. Usuários (CRUD de usuários, ativação e inativação de conta e alteração de permissões próprias do usuário)
  3. Temas (CRUD de temas e alteração dos temas ativos)
  4. Itens Menu (CRUD de itens do menu e alteração dos itens ativos)
  5. Logs (listagem de logs)

O seeder [002_Perfis](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/database/seeders/002_Perfis.ts) salva o perfil Admin como padrão.

O seeder [003_TiposPermissao](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/database/seeders/003_TiposPermissao.ts) salva os seguintes tipos básicos:

  1. Listar
  2. Criar
  3. Editar
  4. Deletar
  5. Alterar status
  6. Alterar Permissão

[004_PermissoesModulos](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/database/seeders/004_PermissoesModulos.ts):

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

é possível informar a permissão da rota GET /perfis usando o slug perfis-criar:

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

O seeder [005_UsuarioAdmin](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/database/seeders/005_UsuarioAdmin.ts) cria um usuário admin master com email e senha padrões.

O seeder [006_PermissoesAdmin](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/database/seeders/006_PermissoesAdmin.ts) dá permissões para todos os módulos cadastrados no seeder `001_Modulos` ao usuário Admin. Note que estas permissões são salvas com a coluna `permissao_fixada = 1`, ou seja, este usuário não precisa de um perfil. As permissões são adicionadas diretamente e permanecerão mesmo que ele seja associado a um perfil.

Por fim, o seeder [007_ItensMenu](https://bitbucket.org/padrao-paineis-web-quaestum/api-projeto/raw/beee4d17bf1b9f82cd2208de9039d7059323c739/database/seeders/007_ItensMenu.ts) cadastra os itens de menu padrão do sistema, configurados com permissões necessárias para poderem ser visualizados no frontend.

---
Cada um dos seeders pode ser alterado para atender os requisitos do seu projeto. Para adicionar novos itens à tabela Módulos, Tipos de Permissão etc, basta alterar o seeder e executá-lo unicamente com:

```bash
node ace db:seed --files="database/seeder/<NOME DO SEEDER>"
```

Veja mais sobre o método [fetchOrCreateMany](https://v5-docs.adonisjs.com/reference/orm/base-model#static-fetchorcreatemany) usado nos seeders para poder executar o mesmo seeder múltiplas vezes sem recadastrar itens já cadastrados.