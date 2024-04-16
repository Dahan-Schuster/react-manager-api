import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import PaletaCoresSistema from "App/Models/PaletaCoresSistema";

export default class DeletePaletasController {
  public async handle({ request, response }: HttpContextContract) {
    const id = request.param("id", 0);
    const paleta = await PaletaCoresSistema.findOrFail(id);

    await Database.transaction(async (trx) => {
      paleta.useTransaction(trx);
      await paleta.related("temasMui").detach();
      await paleta.delete();
      response.send({
        success: true,
      });
    });
  }
}
