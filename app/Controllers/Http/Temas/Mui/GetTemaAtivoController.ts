import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ApiError from "App/Exceptions/ApiError";
import TemaMuiSistema from "App/Models/TemaMuiSistema";

export default class GetTemaAtivoController {
  public async getTema({ response }: HttpContextContract, mode: MUI.MuiMode) {
    const tema = await TemaMuiSistema.getAtivo(mode);
    if (!tema) throw new ApiError("Nenhum tema encontrado", 404);

    return response.send({
      success: true,
      tema,
    });
  }

  public async light(ctx: HttpContextContract) {
    return this.getTema(ctx, "light");
  }

  public async dark(ctx: HttpContextContract) {
    return this.getTema(ctx, "dark");
  }
}
