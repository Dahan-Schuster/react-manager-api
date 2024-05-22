import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class UnlinkPermissaoUsuarioController {
  public async handle({ response, request }: HttpContextContract) {
    const id = request.param("id", 0);
    const idPermissao = request.param("idPermissao", 0);

    const user = await User.findOrFail(id);

    await user.related("permissoes").detach([idPermissao]);
    await user.load("permissoes");

    response.send({
      success: true,
      modulo: user,
    });
  }
}
