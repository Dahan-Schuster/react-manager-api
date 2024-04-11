import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";
import { userValidationMessages } from "App/Enums/ValidationMessages";
const minPasswordLength = Env.get("MIN_PASSWORD_LENGTH");

export default class StoreUsersController {
  public async handle({ request, response }: HttpContextContract) {
    const newUserSchema = schema.create({
      nome: schema.string(),
      email: schema.string([rules.email()]),
      password: schema.string([
        rules.minLength(minPasswordLength),
        rules.confirmed(),
      ]),
    });

    const data = await request.validate({
      schema: newUserSchema,
      messages: userValidationMessages,
    });

    const user = await User.create(data);
    response.send({
      success: true,
      user: user.toJSON(),
    });
  }
}
