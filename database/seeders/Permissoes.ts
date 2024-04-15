import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Permissao from "App/Models/Permissao";

export default class extends BaseSeeder {
  public async run() {
    await Permissao.fetchOrCreateMany(
      ["tipoId", "moduloId"],
      [
        // CRUD perfis
        {
          tipoId: 1,
          moduloId: 1,
          label: "Listar perfis",
          slug: "perfis-listar",
        },
        {
          tipoId: 2,
          moduloId: 1,
          label: "Cadastrar perfil",
          slug: "perfis-criar",
        },
        {
          tipoId: 3,
          moduloId: 1,
          label: "Editar perfil",
          slug: "perfis-editar",
        },
        {
          tipoId: 4,
          moduloId: 1,
          label: "Deletar perfil",
          slug: "perfis-deletar",
        },

        // CRUD usuários
        {
          tipoId: 1,
          moduloId: 2,
          label: "Listar usuário",
          slug: "usuarios-listar",
        },
        {
          tipoId: 2,
          moduloId: 2,
          label: "Cadastrar usuário",
          slug: "usuarios-criar",
        },
        {
          tipoId: 3,
          moduloId: 2,
          label: "Editar usuário",
          slug: "usuarios-editar",
        },
        {
          tipoId: 4,
          moduloId: 2,
          label: "Deletar usuário",
          slug: "usuarios-deletar",
        },
        {
          tipoId: 5,
          moduloId: 2,
          label: "Alterar status usuário",
          slug: "usuarios-alterar-status",
        },
        {
          tipoId: 6,
          moduloId: 2,
          label: "Alterar permissões usuário",
          slug: "usuarios-alterar-permissao",
        },
      ]
    );
  }
}
