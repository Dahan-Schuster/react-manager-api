import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import TemaMuiSistema from "App/Models/TemaMuiSistema";

export default class GetTemasController {
  public async handle({ response }: HttpContextContract) {
    const temasRaw = await TemaMuiSistema.query()
      .preload("paletasCores")
      .orderBy("nome", "asc")
      .orderBy("id", "asc");

    const temas = temasRaw.map((tema) => TemaMuiSistema.formatarPaletas(tema));

    response.send({
      success: true,
      temas,
    });
  }
}
