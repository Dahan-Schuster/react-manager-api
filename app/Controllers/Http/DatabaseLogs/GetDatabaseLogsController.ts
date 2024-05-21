import Env from "@ioc:Adonis/Core/Env";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import DatabaseLog from "App/Models/DatabaseLog";

export default class GetDatabaseLogsController {
  public async handle({ request, response }: HttpContextContract) {
    const page = request.input("page", 1);
    const limit = request.input("per_page", Env.get("DEFAULT_PER_PAGE"));

    const logs = await DatabaseLog.query().orderBy("created_at", "desc").paginate(page, limit);

    response.send({
      success: true,
      logs,
    });
  }
}
