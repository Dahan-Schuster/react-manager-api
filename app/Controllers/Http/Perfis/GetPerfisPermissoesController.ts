import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Perfil from "App/Models/Perfil";

export default class GetPerfisPermissoesController {
  public async handle({ response }: HttpContextContract) {
    const perfis = await Perfil.query()
      .preload("permissoes")
      .orderBy("nome", "asc");

    response.send({
      success: true,
      perfis,
    });
  }
}
