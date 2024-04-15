import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
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

    const { permissoes: novasPermissoes = [], ...data } =
      await request.validate({
        schema: validationSchema,
      });

    const id = request.param("id");

    await Database.transaction(async (trx) => {
      const perfil = await Perfil.findOrFail(id);
      perfil.useTransaction(trx);

      // atualiza os dados do perfil
      await perfil.merge(data).save();

      // salva as permissões antigas do perfil
      await perfil.load("permissoes");
      const permissoesAntigas = perfil.permissoes.map((p) => p.id);

      const permissoesDeletar = permissoesAntigas.filter(
        (p) => !novasPermissoes.includes(p)
      );
      const permissoesAdicionar = novasPermissoes.filter(
        (p) => !permissoesAntigas.includes(p)
      );

      // sincroniza as novas permissões no perfil
      await perfil.related("permissoes").sync(novasPermissoes);

      // console.log("");
      // console.log("permissoesAntigas", permissoesAntigas);
      // console.log("novasPermissoes", novasPermissoes);
      // console.log("permissoes a deletar", permissoesDeletar);
      // console.log("permissoes a adicionar", permissoesAdicionar);

      // deleta as permissões de usuário que não estão mais inclusas no perfil
      await Database.query()
        .useTransaction(trx)
        .from("permissoes_usuarios")
        .innerJoin("users", "users.id", "permissoes_usuarios.user_id")
        .where("users.perfil_id", perfil.id)
        .andWhere("permissao_fixada", 0)
        .whereIn("permissao_id", permissoesDeletar)
        .delete();

      const usersPerfil = await perfil
        .related("users")
        .query()
        .preload("permissoes");

      // adiciona as permissões de usuário que estão inclusas no perfil
      await Promise.all(
        usersPerfil.map(async (user) => {
          // para cada user, verifica quais permissões ainda não foram adicionadas,
          // para evitar duplicação de registros
          const permissoesFixadasUser = user.permissoes
            .filter((p) => permissoesAdicionar.includes(p.id))
            .map((p) => p.id);

          const permissoesAdicionarUser = permissoesAdicionar.filter(
            (p) => !permissoesFixadasUser.includes(p)
          );

          // console.log("");
          // console.log("user", user.nome);
          // console.log("permissoesFixadasUser", permissoesFixadasUser);
          // console.log("permissoesAdicionarUser", permissoesAdicionarUser);

          return user
            .useTransaction(trx)
            .related("permissoes")
            .attach(permissoesAdicionarUser);
        })
      );

      await perfil.load("permissoes");

      response.send({
        success: true,
        perfil: perfil.toJSON(),
      });
    });
  }
}
