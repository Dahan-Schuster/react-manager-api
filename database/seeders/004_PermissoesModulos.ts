import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Modulo from "App/Models/Modulo";
import Permissao from "App/Models/Permissao";
import TipoPermissao from "App/Models/TipoPermissao";

export default class extends BaseSeeder {
  public async run() {
    const tipoListar = await TipoPermissao.query().where("nome", "Listar").firstOrFail();
    const tipoCriar = await TipoPermissao.query().where("nome", "Criar").firstOrFail();
    const tipoEditar = await TipoPermissao.query().where("nome", "Editar").firstOrFail();
    const tipoDeletar = await TipoPermissao.query().where("nome", "Deletar").firstOrFail();
    const tipoAlterarStatus = await TipoPermissao.query()
      .where("nome", "Alterar status")
      .firstOrFail();
    const tipoAlterarPermissao = await TipoPermissao.query()
      .where("nome", "Alterar Permissão")
      .firstOrFail();

    const moduloPerfis = await Modulo.query().where("nome", "Perfis").firstOrFail();
    const moduloUsuarios = await Modulo.query().where("nome", "Usuários").firstOrFail();
    const moduloTemas = await Modulo.query().where("nome", "Temas").firstOrFail();
    const moduloItensMenu = await Modulo.query().where("nome", "Itens Menu").firstOrFail();
    const moduloLogs = await Modulo.query().where("nome", "Logs").firstOrFail();

    await Permissao.fetchOrCreateMany(
      ["tipoId", "moduloId"],
      [
        // CRUD perfis
        {
          tipoId: tipoListar.id,
          moduloId: moduloPerfis.id,
          label: "Listar perfis",
          slug: "perfis-listar",
        },
        {
          tipoId: tipoCriar.id,
          moduloId: moduloPerfis.id,
          label: "Cadastrar perfil",
          slug: "perfis-criar",
        },
        {
          tipoId: tipoEditar.id,
          moduloId: moduloPerfis.id,
          label: "Editar perfil",
          slug: "perfis-editar",
        },
        {
          tipoId: tipoDeletar.id,
          moduloId: moduloPerfis.id,
          label: "Deletar perfil",
          slug: "perfis-deletar",
        },

        // CRUD usuários
        {
          tipoId: tipoListar.id,
          moduloId: moduloUsuarios.id,
          label: "Listar usuário",
          slug: "usuarios-listar",
        },
        {
          tipoId: tipoCriar.id,
          moduloId: moduloUsuarios.id,
          label: "Cadastrar usuário",
          slug: "usuarios-criar",
        },
        {
          tipoId: tipoEditar.id,
          moduloId: moduloUsuarios.id,
          label: "Editar usuário",
          slug: "usuarios-editar",
        },
        {
          tipoId: tipoDeletar.id,
          moduloId: moduloUsuarios.id,
          label: "Deletar usuário",
          slug: "usuarios-deletar",
        },
        {
          tipoId: tipoAlterarStatus.id,
          moduloId: moduloUsuarios.id,
          label: "Alterar status usuário",
          slug: "usuarios-alterar-status",
        },
        {
          tipoId: tipoAlterarPermissao.id,
          moduloId: moduloUsuarios.id,
          label: "Alterar permissões usuário",
          slug: "usuarios-alterar-permissao",
        },

        // CRUD temas
        {
          tipoId: tipoListar.id,
          moduloId: moduloTemas.id,
          label: "Listar temas",
          slug: "temas-listar",
        },
        {
          tipoId: tipoCriar.id,
          moduloId: moduloTemas.id,
          label: "Cadastrar tema",
          slug: "temas-criar",
        },
        {
          tipoId: tipoEditar.id,
          moduloId: moduloTemas.id,
          label: "Editar tema",
          slug: "temas-editar",
        },
        {
          tipoId: tipoDeletar.id,
          moduloId: moduloTemas.id,
          label: "Deletar tema",
          slug: "temas-deletar",
        },
        {
          tipoId: tipoAlterarStatus.id,
          moduloId: moduloTemas.id,
          label: "Alterar status tema",
          slug: "temas-alterar-status",
        },

        // CRUD itens menu
        {
          tipoId: tipoListar.id,
          moduloId: moduloItensMenu.id,
          label: "Listar itens do menu (tabela de administração)",
          slug: "itens-menu-listar",
        },
        {
          tipoId: tipoCriar.id,
          moduloId: moduloItensMenu.id,
          label: "Cadastrar item do menu",
          slug: "itens-menu-criar",
        },
        {
          tipoId: tipoEditar.id,
          moduloId: moduloItensMenu.id,
          label: "Editar item do menu",
          slug: "itens-menu-editar",
        },
        {
          tipoId: tipoDeletar.id,
          moduloId: moduloItensMenu.id,
          label: "Deletar item do menu",
          slug: "itens-menu-deletar",
        },

        // Logs
        {
          tipoId: tipoListar.id,
          moduloId: moduloLogs.id,
          label: "Listar logs",
          slug: "logs-listar",
        },
      ]
    );
  }
}
