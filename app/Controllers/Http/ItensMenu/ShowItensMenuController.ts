import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import MenuItem from "App/Models/MenuItem";

export default class ShowItensMenuController {
  public async handle({ response, request }: HttpContextContract) {
    const id = request.param("id", 0);
    const item = await MenuItem.findOrFail(id);

    if (item.parent_id) {
      await item.load("parent");
    }

    response.send({
      success: true,
      item,
    });
  }
}
