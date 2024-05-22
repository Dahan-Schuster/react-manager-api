import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class GetUsersController {
  public async handle({ response, request }: HttpContextContract) {
    const id = request.param("id");
    const user = await User.findOrFail(id);

    if (user.deletedBy) {
      await user.load("deletedByUser");
    }

    if (user.perfilId) {
      await user.load("perfil");
    }

    await user.load("permissoes");

    return response.send({
      success: true,
      user: {
        ...user.toJSON(),
        permissoes: user.permissoes?.map((p) => ({
          ...p.toJSON(),
          fixada: p.$extras.pivot_permissao_fixada,
        })),
      },
    });
  }
}
