import Env from "@ioc:Adonis/Core/Env";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class GetUsersController {
  public async handle({ response, request }: HttpContextContract) {
    const page = request.input("page", 1);
    const limit = request.input("per_page", Env.get("DEFAULT_PER_PAGE"));
    const role = request.input("role", "");
    const nome = request.input("nome", "");
    const email = request.input("email", "");
    const status = parseInt(request.input("status", null));
    const perfilId = parseInt(request.input("perfilId", null));

    const query = User.query()
      .whereNull("deleted_at")
      .orderBy("status", "desc");

    if (role) {
      query.where("role", role);
    }

    if (nome) {
      query.whereILike("name", `%${nome}%`);
    }

    if (email) {
      query.whereILike("email", `%${email}%`);
    }

    if (!isNaN(status)) {
      query.where("status", status);
    }

    if (!isNaN(perfilId) && perfilId > 0) {
      query.where("perfilId", perfilId);
    }

    const users = await query.paginate(page, limit);
    await Promise.all(
      users.filter((u) => !!u.perfilId).map((u) => u.load("perfil"))
    );

    response.send({
      status: status,
      success: true,
      users,
    });
  }
}
