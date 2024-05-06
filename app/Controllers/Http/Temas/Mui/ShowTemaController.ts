import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import TemaMuiSistema from "App/Models/TemaMuiSistema";

export default class ShowTemaController {
  public async handle({ response, request }: HttpContextContract) {
    const id = request.param("id", 0);
    const tema = await TemaMuiSistema.findOrFail(id);

    response.send({
      success: true,
      tema,
    });
  }
}
