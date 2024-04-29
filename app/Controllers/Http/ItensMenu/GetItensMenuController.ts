import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import MenuItem from "App/Models/MenuItem";

export default class GetItensMenuController {
  public async handle({ response }: HttpContextContract) {
    const itens = await MenuItem.query()
      .preload("children")
      .whereNull("parent_id")
      .orderBy("label", "asc")
      .orderBy("id", "asc");

    await Promise.all(
      itens.filter((i) => !!i.parent_id).map((i) => i.load("parent"))
    );

    response.send({
      success: true,
      itens,
    });
  }
}
