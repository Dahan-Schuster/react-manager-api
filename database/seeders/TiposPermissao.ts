import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import TipoPermissao from "App/Models/TipoPermissao";

export default class extends BaseSeeder {
  public async run() {
    await TipoPermissao.fetchOrCreateMany("nome", [
      { nome: "Listar" },
      { nome: "Criar" },
      { nome: "Editar" },
      { nome: "Deletar" },
      { nome: "Alterar status" },
    ]);
  }
}
