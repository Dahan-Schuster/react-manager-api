import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ImagemSistema from "App/Models/ImagemSistema";

export default class GetPaletasController {
  public async handle({ response }: HttpContextContract) {
    const imagens = await ImagemSistema.query().orderBy("id", "asc");
    response.send({
      success: true,
      imagens,
    });
  }
}
