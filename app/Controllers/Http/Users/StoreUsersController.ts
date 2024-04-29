import Env from "@ioc:Adonis/Core/Env";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
import { userValidationMessages } from "App/Enums/ValidationMessages";
import ApiError from "App/Exceptions/ApiError";
import RecoveryToken from "App/Models/RecoveryToken";
import User from "App/Models/User";
import SendMail from "App/Services/SendEmail";
import { DateTime } from "luxon";
import randomstring from "randomstring";

const minPasswordLength = Env.get("MIN_PASSWORD_LENGTH");

export default class StoreUsersController {
  public async handle({ request, response }: HttpContextContract) {
    const newUserSchema = schema.create({
      nome: schema.string(),
      email: schema.string([rules.email()]),
      password: schema.string.optional([
        rules.minLength(minPasswordLength),
        rules.confirmed(),
      ]),
      perfil_id: schema.number.optional([
        rules.exists({ table: "perfis", column: "id" }),
      ]),
    });

    const data = await request.validate({
      schema: newUserSchema,
      messages: userValidationMessages,
    });

    await Database.transaction(async (trx) => {
      const user = new User();
      user.useTransaction(trx);

      // cria o usuário
      await user.fill({ ...data, status: 1 }).save();

      if (!data.password) {
        // configura um novo token para definir a senha do usuário
        const tokenString = randomstring.generate();
        await RecoveryToken.create({
          email: user.email,
          token: tokenString,
          expiresAt: DateTime.now().plus({ days: 1 }),
        });

        const url = `${request.header("Origin")}/alterar-senha/${tokenString}`;

        const statusEmail = await SendMail.send(
          user.email,
          `Criar nova senha - ${Env.get("NOME_CLIENTE")}`,
          "emails/create_new_password",
          {
            name: user.nome,
            url,
          },
          false
        );

        if (!statusEmail.status) {
          await trx.rollback();
          throw new ApiError(
            "Usuário não criado! " + statusEmail.mensagem,
            500
          );
        }
      }

      if (user.perfilId) {
        await user.load("perfil");
      }

      response.send({
        success: true,
        user: user.toJSON(),
      });
    });
  }
}
