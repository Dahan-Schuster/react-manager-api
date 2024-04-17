import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import TemaMuiSistema from "App/Models/TemaMuiSistema";

export default class ChangeStatusTemaController {
  public async handle({ request, response }: HttpContextContract) {
    const { id } = request.params();

    await Database.transaction(async (trx) => {
      const tema = await TemaMuiSistema.findOrFail(id);
      tema.useTransaction(trx);

      await TemaMuiSistema.inativarOutrosTemas(tema);
      tema.ativo = tema.ativo ? 0 : 1;

      await tema.save();

      return response.send({
        success: true,
        tema,
      });
    });
  }
}
