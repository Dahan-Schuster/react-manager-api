import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Modulo from "App/Models/Modulo";
import TipoPermissao from "App/Models/TipoPermissao";
import StringTools from "App/Services/StringTools";

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
          label: schema.string.optional({ trim: true }),
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

    const tiposFormatados = await Promise.all(
      tiposPermissoes.map(async (tp) => {
        const tipo = await TipoPermissao.findOrFail(tp.tipoId);
        const slug = StringTools.slugify(modulo.nome + "-" + tipo.nome);

        return {
          ...tp,
          label: tp.label || tipo.nome + " " + modulo.nome,
          slug,
        };
      })
    );

    // cria os tipos que estiverem na requisição e não estiverem no módulo
    // e edita os que já estiverem no módulo
    await modulo
      .related("tiposPermissoes")
      .updateOrCreateMany(tiposFormatados, ["tipoId"]);

    await modulo.load("tiposPermissoes");

    response.send({
      success: true,
      modulo,
    });
  }
}
