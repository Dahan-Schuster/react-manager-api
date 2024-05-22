import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Perfil from "App/Models/Perfil";

export default class ShowPerfilController {
  public async handle({ response, request }: HttpContextContract) {
    const id = request.param("id", 0);
    const perfil = await Perfil.findOrFail(id);

    response.send({
      success: true,
      perfil,
    });
  }
}
