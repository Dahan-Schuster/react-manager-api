import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { userValidationMessages } from "App/Enums/ValidationMessages";
import User from "App/Models/User";

export default class AlterarPerfilUsuarioController {
  public async handle({ request, response }: HttpContextContract) {
    const newUserSchema = schema.create({
      perfilId: schema.number.optional([
        rules.exists({ table: "perfis", column: "id" }),
      ]),
    });

    const { perfilId } = await request.validate({
      schema: newUserSchema,
      messages: userValidationMessages,
    });

    const id = request.param("id", 0);
    const user = await User.findOrFail(id);

    await user.merge({ perfilId: perfilId ? perfilId : null }).save();
    await user.load("perfil");
    await user.load("permissoes");

    response.send({
      success: true,
      user: {
        ...user.toJSON(),
        permissoes: user.permissoes?.map((p) => ({
          ...p.toJSON(),
          fixada: p.$extras.pivot_permissao_fixada,
        })),
      },
    });
  }
}
