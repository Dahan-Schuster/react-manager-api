import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Perfil from "App/Models/Perfil";

export default class extends BaseSeeder {
  public async run() {
    await Perfil.fetchOrCreateMany("nome", [{ nome: "Admin" }]);
  }
}
