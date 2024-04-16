import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import PaletaCoresSistema from "App/Models/PaletaCoresSistema";

export default class ShowPaletaController {
  public async handle({ response, request }: HttpContextContract) {
    const id = request.param("id", 0);
    const paleta = await PaletaCoresSistema.findOrFail(id);
    response.send({
      success: true,
      paleta,
    });
  }
}
