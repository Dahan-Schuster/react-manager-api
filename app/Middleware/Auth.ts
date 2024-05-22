import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ApiError from "App/Exceptions/ApiError";

export default class AuthMiddleware {
  protected async authenticate(auth: HttpContextContract["auth"]) {
    if (!(await auth.use("jwt").check())) {
      throw new ApiError("Usuário não autenticado", 401);
    }
    return true;
  }

  public async handle(
    { auth }: HttpContextContract,
    next: () => Promise<void>,
    permissoes?: string[]
  ) {
    await this.authenticate(auth);

    if (permissoes?.length) {
      const user = auth.user!;
      await user.load("permissoes");
      if (!user.permissoes.some((p) => permissoes.includes(p.slug))) {
        throw new ApiError("Acesso negado", 403);
      }
    }

    await next();
  }
}
