import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import ApiError from "App/Exceptions/ApiError";
import TemaMuiSistema from "App/Models/TemaMuiSistema";

export default class AtivarTemaController {
  public async handle({ request, response }: HttpContextContract) {
    const { id } = request.params();

    await Database.transaction(async (trx) => {
      const tema = await TemaMuiSistema.findOrFail(id);
      tema.useTransaction(trx);

      if (tema.ativo) {
        throw new ApiError("Tema já está ativo", 400);
      }

      await TemaMuiSistema.inativarOutrosTemas(tema);
      tema.ativo = 1;

      await tema.save();

      const temas = await TemaMuiSistema.query().orderBy("id", "asc");

      return response.send({
        success: true,
        tema,
        temas,
      });
    });
  }
}
