import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Permissao from "App/Models/Permissao";

export default class extends BaseSeeder {
  public async run() {
    await Permissao.fetchOrCreateMany(
      ["tipoId", "moduloId"],
      [
        // CRUD usuários
        { tipoId: 1, moduloId: 2, label: "Listar usuário" },
        { tipoId: 2, moduloId: 2, label: "Cadastrar usuário" },
        { tipoId: 3, moduloId: 2, label: "Editar usuário" },
        { tipoId: 4, moduloId: 2, label: "Deletar usuário" },
        { tipoId: 5, moduloId: 2, label: "Alterar status usuário" },
      ]
    );
  }
}
