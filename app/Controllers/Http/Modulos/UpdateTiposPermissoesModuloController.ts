import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Modulo from "App/Models/Modulo";

export default class UpdateTiposPermissoesModuloController {
  public async handle({ response, request }: HttpContextContract) {
    const id = request.param("id", 0);
    const modulo = await Modulo.findOrFail(id);

    const validationSchema = schema.create({
      tiposPermissoes: schema.array().members(
        schema.object().members({
          tipoId: schema.number([
            rules.exists({ table: "tipos_permissoes", column: "id" }),
          ]),
          label: schema.string({ trim: true }),
        })
      ),
    });

    const { tiposPermissoes } = await request.validate({
      schema: validationSchema,
    });

    // deleta os tipos que não vieram na requisição e estiverem no módulo
    await modulo
      .related("tiposPermissoes")
      .query()
      .whereNotIn(
        "tipo_id",
        tiposPermissoes.map((tp) => tp.tipoId)
      )
      .delete();

    // cria os tipos que estiverem na requisição e não estiverem no módulo
    // e edita os que já estiverem no módulo
    await modulo
      .related("tiposPermissoes")
      .updateOrCreateMany(tiposPermissoes, ["tipoId"]);

    await modulo.load("tiposPermissoes");

    response.send({
      success: true,
      modulo,
    });
  }
}
