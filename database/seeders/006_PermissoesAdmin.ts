import { ModelObject } from "@ioc:Adonis/Lucid/Orm";
import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import Permissao from "App/Models/Permissao";
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    const user = await User.query()
      .where("email", "admin@teste.com.br")
      .first();

    if (!user) return;

    const permissoes = await Permissao.query()
      .select("id")
      .whereIn("modulo_id", [1, 2, 3, 4]);

    await user.load("permissoes");
    const idsPermissoesUser = user.permissoes.map((p) => p.id);
    const idsNovasPermissoes = permissoes
      .filter((p) => !idsPermissoesUser.includes(p.id))
      .map((p) => p.id);

    console.log(
      "Novas permissões para o admin:",
      idsNovasPermissoes.toString()
    );

    await user.related("permissoes").attach(
      idsNovasPermissoes.reduce((prev, curr) => {
        prev[curr] = { permissao_fixada: true };
        return prev;
      }, {} as Record<string, ModelObject>)
    );
  }
}
