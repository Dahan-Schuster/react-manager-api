import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Perfil from "App/Models/Perfil";

export default class DeletePerfisController {
  public async handle({ request, response }: HttpContextContract) {
    const id = request.param("id", 0);
    const perfil = await Perfil.findOrFail(id);

    await Database.transaction(async (trx) => {
      perfil.useTransaction(trx);
      await perfil.related("permissoes").detach();

      // deleta as permissões de usuário que tinham sido herdadas pelo perfil
      await Database.query()
        .useTransaction(trx)
        .from("permissoes_usuarios")
        .innerJoin("users", "users.id", "permissoes_usuarios.user_id")
        .where("users.perfil_id", perfil.id)
        .andWhere("permissao_fixada", 0)
        .delete();

      await perfil.delete();
      response.send({
        success: true,
      });
    });
  }
}
