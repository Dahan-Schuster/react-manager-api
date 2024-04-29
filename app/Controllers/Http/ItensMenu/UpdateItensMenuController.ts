import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
import { defaultValidationMessages } from "App/Enums/ValidationMessages";
import MenuItem from "App/Models/MenuItem";

export default class UpdateItensMenuController {
  public async handle({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      label: schema.string.optional({ trim: true }),
      url: schema.string.optional({ trim: true }),
      target: schema.enum.optional(["_self", "_blank", "_parent", "_top"]),
      icone: schema.string.optional(),
      parent_id: schema.number.optional([
        rules.exists({ table: "menu_items", column: "id" }),
      ]),
      permissoes: schema.array
        .optional()
        .members(
          schema.number([rules.exists({ table: "permissoes", column: "id" })])
        ),
    });

    const { permissoes = [], ...data } = await request.validate({
      schema: validationSchema,
      messages: defaultValidationMessages,
    });

    await Database.transaction(async (trx) => {
      const item = await MenuItem.query()
        .useTransaction(trx)
        .where("id", request.param("id"))
        .firstOrFail();

      await item.merge(data).save();
      if (permissoes !== undefined) {
        await item.related("permissoes").sync(permissoes);
      }

      await item.load("permissoes");
      if (item.parent_id) {
        await item.load("parent");
      }

      response.send({
        success: true,
        item: item.toJSON(),
      });
    });
  }
}
