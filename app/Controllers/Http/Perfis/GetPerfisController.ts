import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Perfil from "App/Models/Perfil";

export default class GetPerfisController {
  public async handle({ response }: HttpContextContract) {
    const perfis = await Perfil.query().orderBy("nome", "asc");
    response.send({
      success: true,
      perfis,
    });
  }
}
