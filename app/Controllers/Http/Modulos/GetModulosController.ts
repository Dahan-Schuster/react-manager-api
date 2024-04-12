import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Modulo from "App/Models/Modulo";

export default class GetModulosController {
  public async handle({ response }: HttpContextContract) {
    const modulos = await Modulo.query().preload("tiposPermissoes");

    response.send({
      success: true,
      modulos,
    });
  }
}
