import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import ImagemSistema from "App/Models/ImagemSistema";
import UploadImagem from "App/Services/UploadImagem";

export default class DeletePaletasController {
  public async handle({ request, response }: HttpContextContract) {
    const id = request.param("id", 0);
    const imagem = await ImagemSistema.findOrFail(id);

    await Database.transaction(async (trx) => {
      imagem.useTransaction(trx);

      await UploadImagem.delete(imagem.url.replace("public", ""));
      await imagem.delete();

      response.send({
        success: true,
      });
    });
  }
}
