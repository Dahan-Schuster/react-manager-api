import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Perfil from "App/Models/Perfil";

export default class UpdatePerfisController {
  public async handle({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      nome: schema.string.optional(),
      permissoes: schema.array
        .optional()
        .members(
          schema.number([rules.exists({ table: "permissoes", column: "id" })])
        ),
    });

    const { permissoes, ...data } = await request.validate({
      schema: validationSchema,
    });

    const id = request.param("id");

    const perfil = await Perfil.findOrFail(id);
    await perfil.merge(data).save();

    if (permissoes?.length) {
      perfil.related("permissoes").sync(permissoes);

      // TODO: atualizar as permissões dos usuários que o perfil tiver
    }

    response.send({
      success: true,
      perfil: perfil.toJSON(),
    });
  }
}
