import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class LogoutsController {
  public async handle({ auth, response }: HttpContextContract) {
    await auth.use("jwt").revoke();
    return response.send({
      success: true,
    });
  }
}
