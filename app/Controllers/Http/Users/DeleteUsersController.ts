import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";
import { DateTime } from "luxon";

export default class DeleteUsersController {
  public async handle({ auth, request, response }: HttpContextContract) {
    const loggedUser = auth.user!;

    const id = request.param("id", 0);
    const user = await User.findOrFail(id);

    await Database.from("jwt_tokens").where("user_id", id).delete();
    await user.load("permissoes");
    await user.related("permissoes").detach(user.permissoes.map((p) => p.id));

    await user
      .merge({
        status: 0,
        deletedBy: loggedUser.id,
        deletedAt: DateTime.now(),
      })
      .save();

    response.send({
      success: true,
    });
  }
}
