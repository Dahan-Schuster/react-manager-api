import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import TemaMuiSistema from "App/Models/TemaMuiSistema";
import UploadImagem from "App/Services/UploadImagem";

export default class DeleteTemasController {
  public async handle({ request, response }: HttpContextContract) {
    const id = request.param("id");
    await Database.transaction(async (trx) => {
      const tema = await TemaMuiSistema.findOrFail(id);
      tema.useTransaction(trx);

      await tema.related("paletasCores").detach();
      await tema.delete();

      await Promise.all([
        UploadImagem.delete(tema.urlFavicon),
        UploadImagem.delete(tema.urlLogoHeader),
        UploadImagem.delete(tema.urlLogoLogin),
        UploadImagem.delete(tema.urlLogoSimples),
      ]);

      response.send({
        success: true,
      });
    });
  }
}
