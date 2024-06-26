import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import { rules, schema } from "@ioc:Adonis/Core/Validator";

import { DateTime } from "luxon";
import randomstring from "randomstring";

import RecoveryToken from "App/Models/RecoveryToken";
import User from "App/Models/User";
import SendMail from "App/Services/SendEmail";
import ApiError from "App/Exceptions/ApiError";

export default class SendPasswordRecoveryEmailController {
  public async handle({ response, request }: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string({ escape: true, trim: true }, [rules.email()]),
    });

    const { email } = await request.validate({ schema: validationSchema });

    const user = await User.findBy("email", email);
    if (!user) {
      throw new ApiError("Usuário não encontrado", 400);
    }

    // deleta tokens previamente criados
    await RecoveryToken.query().where("email", email).delete();

    const tokenString = randomstring.generate();
    const recoveryToken = await RecoveryToken.create({
      email,
      token: tokenString,
      expiresAt: DateTime.now().plus({ hours: 1 }),
    });

    const url = `${request.header("Origin")}/alterar-senha/${tokenString}`;

    const statusEmail = await SendMail.send(
      email,
      `Recuperação de senha - ${Env.get("NOME_CLIENTE")}`,
      "emails/password_recovery",
      {
        name: user.nome,
        url,
      },
      false
    );

    if (!statusEmail.status) {
      await recoveryToken.delete();
      throw new ApiError(statusEmail.mensagem, 500);
    }

    response.send({
      success: true,
      mensagem: statusEmail.mensagem,
      token: recoveryToken.toJSON(),
    });
  }
}
