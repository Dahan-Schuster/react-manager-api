/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from "@ioc:Adonis/Core/Logger";
import HttpExceptionHandler from "@ioc:Adonis/Core/HttpExceptionHandler";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ApiError from "./ApiError";

interface ErrorResponse {
  success: boolean;
  error: string;
  [x: string]: any;
}

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger);
  }

  private ErrorResponsesByCode: Map<
    string,
    (error?: any) => [number, ErrorResponse]
  > = new Map()
    .set("E_UNAUTHORIZED_ACCESS", () => [
      401,
      { success: false, error: "Usuário não autenticado" },
    ])
    .set(
      "E_VALIDATION_FAILURE",
      (error: { messages: { errors: { message: any }[] } }) => [
        422,
        {
          success: false,
          error: error.messages.errors[0].message,
          ...error.messages,
        },
      ]
    )
    .set("E_ROUTE_NOT_FOUND", () => [
      404,
      { success: false, error: "Rota não encontrada" },
    ])
    .set("E_ROW_NOT_FOUND", () => [
      404,
      { success: false, error: "Registro não encontrado" },
    ])
    .set("ER_NO_REFERENCED_ROW_2", () =>
      this.ErrorResponsesByCode.get("E_ROW_NOT_FOUND")!()
    )
    .set("ER_DUP_ENTRY", () => [
      409,
      { success: false, error: "Registro duplicado" },
    ])
    .set("ER_NO_SUCH_TABLE", () => [
      500,
      { success: false, error: "Tabela não encontrada" },
    ]);

  private defaultHandler = (): [number, ErrorResponse] => [
    500,
    { success: false, error: "Erro desconhecido" },
  ];

  public async handle(error: any, ctx: HttpContextContract) {
    if (error instanceof ApiError) {
      return ctx.response.status(error.code).send({
        success: false,
        error: error.message,
      });
    } else {
      const handler =
        this.ErrorResponsesByCode.get(error.code) || this.defaultHandler;
      const [httpCode, errorResponse] = handler(error);
      return ctx.response.status(httpCode).send(errorResponse);
    }
  }

  public async report(exception: any, { logger }: HttpContextContract) {
    if (exception instanceof ApiError) {
      this.logApiError(exception, logger);
    } else {
      this.logDefaultError(exception, logger);
    }
  }

  private logApiError(
    exception: ApiError,
    logger: HttpContextContract["logger"]
  ) {
    const { code, message } = exception;
    if (code >= 500) {
      logger.error({ message, code, err: exception }, "Erro do servidor");
    } else {
      logger.warn({ message, code }, "Erro do cliente");
    }
  }

  private logDefaultError(
    exception: any,
    logger: HttpContextContract["logger"]
  ) {
    const handler =
      this.ErrorResponsesByCode.get(exception.code) || this.defaultHandler;
    const [httpCode, errorResponse] = handler(exception);
    if (httpCode >= 500) {
      logger.error({ code: httpCode, err: exception }, errorResponse.error);
    } else {
      logger.warn({ code: httpCode, err: errorResponse }, errorResponse.error);
    }
  }
}
