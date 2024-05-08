import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Database from "@ioc:Adonis/Lucid/Database";
import { defaultValidationMessages } from "App/Enums/ValidationMessages";
import MenuItem from "App/Models/MenuItem";

export default class StoreItensMenuController {
  public async handle({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      label: schema.string({ trim: true }),
      url: schema.string.optional({ trim: true }),
      target: schema.enum.optional(["_self", "_blank", "_parent", "_top"]),
      icone: schema.string.optional(),
      ordem: schema.number([rules.unsigned()]),
      publico: schema.boolean.optional(),
      parent_id: schema.number.optional([
        rules.exists({ table: "menu_itens", column: "id" }),
      ]),
      permissoes: schema
        .array()
        .members(
          schema.number([rules.exists({ table: "permissoes", column: "id" })])
        ),
    });

    const { permissoes, ...data } = await request.validate({
      schema: validationSchema,
      messages: defaultValidationMessages,
    });

    await Database.transaction(async (trx) => {
      const item = new MenuItem();
      item.useTransaction(trx);
      if (!data.target) data.target = "_self";
      await item.fill(data).save();
      await item.related("permissoes").sync(permissoes);

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
