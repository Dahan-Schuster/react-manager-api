import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    await User.fetchOrCreateMany("nome", [
      {
        nome: "Admin",
        email: "admin@teste.com.br",
        password: "padrao@123",
        perfilId: 1,
      }
    ]
    );
  }
}
