import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import PaletaCoresSistema from "App/Models/PaletaCoresSistema";

export default class GetPaletasController {
  public async handle({ response }: HttpContextContract) {
    const paletas = await PaletaCoresSistema.query()
      .orderBy("nome", "asc")
      .orderBy("id", "asc");
    response.send({
      success: true,
      paletas,
    });
  }
}
