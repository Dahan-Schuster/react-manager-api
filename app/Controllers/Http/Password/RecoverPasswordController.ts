import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Hash from "@ioc:Adonis/Core/Hash";
import Env from "@ioc:Adonis/Core/Env";
import { schema, rules } from "@ioc:Adonis/Core/Validator";

import { DateTime } from "luxon";

import RecoveryToken from "App/Models/RecoveryToken";
import User from "App/Models/User";
import ApiError from "App/Exceptions/ApiError";

const minPasswordLength = Env.get("MIN_PASSWORD_LENGTH");

export default class RecoverPasswordController {
  public async handle({ response, request }: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string({ escape: true, trim: true }, [rules.email()]),
      token: schema.string({ escape: true, trim: true }),
      new_password: schema.string([
        rules.confirmed(),
        rules.minLength(minPasswordLength),
      ]),
    });

    const {
      email,
      token,
      new_password: newPassword,
    } = await request.validate({ schema: validationSchema });

    const user = await User.findBy("email", email);
    if (!user) {
      throw new ApiError("Usuário não encontrado", 400);
    }

    const recoveryToken = await RecoveryToken.query()
      .where("email", email)
      .first();

    const isTokenValid =
      !!recoveryToken && (await Hash.verify(recoveryToken.token, token));

    if (!isTokenValid) {
      throw new ApiError("Token inválido", 400);
    }

    if (recoveryToken.expiresAt < DateTime.now()) {
      throw new ApiError("Token expirado", 400);
    }

    user.password = newPassword;
    await user.save();
    await recoveryToken.delete();

    response.send({ success: true });
  }
}
