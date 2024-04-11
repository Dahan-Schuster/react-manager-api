import Env from "@ioc:Adonis/Core/Env";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class GetUsersController {
  public async handle({ response, request }: HttpContextContract) {
    const page = request.input("page", 1);
    const limit = request.input("per_page", Env.get("DEFAULT_PER_PAGE"));
    const role = request.input("role", "");
    const name = request.input("name", "");
    const email = request.input("email", "");

    const query = User.query();

    if (role) {
      query.where("role", role);
    }

    if (name) {
      query.whereILike("name", `%${name}%`);
    }

    if (email) {
      query.whereILike("email", `%${email}%`);
    }

    const users = await query.paginate(page, limit);
    response.send({
      success: true,
      users,
    });
  }
}
