import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import { DateTime } from "luxon";

export default class DeleteUsersController {
  public async handle({ auth, request, response }: HttpContextContract) {
    const loggedUser = auth.user!;

    const id = request.param("id", 0);
    const user = await User.findOrFail(id);

    await auth.use("jwt").revoke();
    await user
      .merge({ status: 0, deletedBy: loggedUser.id, deletedAt: DateTime.now() })
      .save();

    response.send({
      success: true,
    });
  }
}
