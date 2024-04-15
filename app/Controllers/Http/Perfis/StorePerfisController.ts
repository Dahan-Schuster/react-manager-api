import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { defaultValidationMessages } from "App/Enums/ValidationMessages";
import Perfil from "App/Models/Perfil";

export default class StorePerfisController {
  public async handle({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      nome: schema.string([rules.unique({ table: "perfis", column: "nome" })]),
      permissoes: schema.array
        .optional()
        .members(
          schema.number([rules.exists({ table: "permissoes", column: "id" })])
        ),
    });

    const { permissoes, ...data } = await request.validate({
      schema: validationSchema,
      messages: defaultValidationMessages,
    });

    const perfil = await Perfil.create(data);

    if (permissoes?.length) {
      perfil.related("permissoes").attach(permissoes);
    }

    response.send({
      success: true,
      perfil: perfil.toJSON(),
    });
  }
}
