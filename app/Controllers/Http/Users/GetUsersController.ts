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
    const status = parseInt(request.input("status", null));

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

    if (!isNaN(status)) {
      query.where("status", status);
    }

    const users = await query.paginate(page, limit);
    response.send({
      status: status,
      success: true,
      users,
    });
  }
}
