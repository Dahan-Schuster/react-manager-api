import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import MenuItem from "App/Models/MenuItem";

export default class DeleteItensMenuController {
  public async handle({ request, response }: HttpContextContract) {
    const id = request.param("id", 0);
    const item = await MenuItem.findOrFail(id);

    await Database.transaction(async (trx) => {
      item.useTransaction(trx);
      await item.delete();
      response.send({
        success: true,
      });
    });
  }
}
