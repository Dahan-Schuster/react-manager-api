import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Perfil from "App/Models/Perfil";

export default class DeletePerfisController {
  public async handle({ request, response }: HttpContextContract) {
    const id = request.param("id", 0);
    const perfis = await Perfil.findOrFail(id);

    await perfis.load("permissoes");
    await perfis
      .related("permissoes")
      .detach(perfis.permissoes.map((p) => p.id));

    // TODO: atualizar as permissões dos usuários que o perfil tiver

    await perfis.delete();
    response.send({
      success: true,
    });
  }
}
