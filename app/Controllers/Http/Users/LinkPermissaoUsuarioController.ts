import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class LinkPermissaoUsuarioController {
  public async handle({ response, request }: HttpContextContract) {
    const id = request.param("id");
    const idPermissao = request.param("idPermissao");

    const user = await User.findOrFail(id);

    const permissaoExistenteUsuario = await user
      .related("permissoes")
      .query()
      .where("permissao_id", idPermissao)
      .first();

    if (permissaoExistenteUsuario) {
      return response.send({
        success: false,
        message: "Permissão já adicionada para este usuário",
      });
    }

    await user.related("permissoes").attach({
      [idPermissao]: {
        permissao_fixada: 1,
      },
    });
    await user.load("permissoes");

    return response.send({
      success: true,
      user,
    });
  }
}
