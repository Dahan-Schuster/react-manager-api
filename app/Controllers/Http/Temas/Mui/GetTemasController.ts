import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import TemaMuiSistema from "App/Models/TemaMuiSistema";

export default class GetTemasController {
  public async handle({ response }: HttpContextContract) {
    const temas = await TemaMuiSistema.query()
      .orderBy("nome", "asc")
      .orderBy("id", "asc");

    response.send({
      success: true,
      temas,
    });
  }
}
