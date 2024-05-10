import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";

export default class UpdatePermissoesUsuarioController {
  public async handle({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      novasPermissoes: schema.array
        .optional()
        .members(
          schema.number([rules.exists({ table: "permissoes", column: "id" })])
        ),
      permissoesDeletar: schema.array
        .optional()
        .members(
          schema.number([rules.exists({ table: "permissoes", column: "id" })])
        ),
    });

    const { novasPermissoes = [], permissoesDeletar = [] } =
      await request.validate({
        schema: validationSchema,
      });

    const id = request.param("id");

    await Database.transaction(async (trx) => {
      const user = await User.findOrFail(id);
      user.useTransaction(trx);

      // verifica quais novas permissões não já estão inclusas
      await user.load("permissoes");
      const permissoesAntigas = user.permissoes.map((p) => p.id);
      const permissoesAdicionar = novasPermissoes.filter(
        (p) => !permissoesAntigas.includes(p)
      );

      /*
       * Formata o array de novas permissões para o formato:
       * {
       *  [idPermissao]: {
       *    permissao_fixada: 1,
       *  },
       * }
       */
      const objetoPermissoesAdicionar = permissoesAdicionar.reduce(
        (objeto, permissao) => {
          return {
            ...objeto,
            [permissao]: {
              permissao_fixada: 1,
            },
          };
        },
        {}
      );

      // sincroniza as novas permissões
      await user.related("permissoes").attach(objetoPermissoesAdicionar);
      if (permissoesDeletar.length) {
        await user.related("permissoes").detach(permissoesDeletar);
      }

      await user.load("permissoes");

      response.send({
        success: true,
        user: user.toJSON(),
      });
    });
  }
}
