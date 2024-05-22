import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import DatabaseLog from "App/Models/DatabaseLog";

export default class GetDatabaseLogsController {
  public async handle({ response }: HttpContextContract) {
    const logs = await DatabaseLog.query();
    response.send({
      success: true,
      logs,
    });
  }
}
