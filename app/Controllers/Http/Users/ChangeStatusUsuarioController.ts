import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";

export default class DeleteUsersController {
  public async handle({ request, response }: HttpContextContract) {
    const id = request.param("id", 0);
    const user = await User.findOrFail(id);

    await user.merge({ status: user.status === 0 ? 1 : 0 }).save();
    if (user.status === 0) {
      await Database.from("jwt_tokens").where("user_id", id).delete();
    }

    response.send({
      success: true,
    });
  }
}
