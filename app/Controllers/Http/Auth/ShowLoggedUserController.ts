import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class ShowLoggedUserController {
  public async handle({ auth, response }: HttpContextContract) {
    response.send({
      success: true,
      user: auth.user,
    });
  }
}
