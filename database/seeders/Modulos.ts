import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Modulo from "App/Models/Modulo";

export default class extends BaseSeeder {
  public async run() {
    await Modulo.fetchOrCreateMany("nome", [
      { nome: "Perfis" },
      { nome: "Usuários" },
      { nome: "Temas" },
      { nome: "Itens Menu" },
    ]);
  }
}
