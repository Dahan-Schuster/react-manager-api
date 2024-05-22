import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class LogRequestMiddleware {
  public async handle(
    { logger, request }: HttpContextContract,
    next: () => Promise<void>
  ) {
    logger.info(
      { data: request.all() },
      `HTTP ${request.method()} ${request.url()}`
    );

    await next();
  }
}
