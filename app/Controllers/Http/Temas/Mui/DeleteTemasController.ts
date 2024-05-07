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

      await tema.delete();

      await Promise.all([
        UploadImagem.delete(tema.url_favicon),
        UploadImagem.delete(tema.url_logo_header),
        UploadImagem.delete(tema.url_logo_login),
        UploadImagem.delete(tema.url_logo_simples),
      ]);

      response.send({
        success: true,
      });
    });
  }
}
