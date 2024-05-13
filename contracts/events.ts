import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import type { ModelObject } from "@ioc:Adonis/Lucid/Orm";

declare module "@ioc:Adonis/Core/Event" {
  /**
   * Definir aqui a tipagem de cada evento
   */
  interface EventsList {
    "new:user": {
      user: ModelObject;
      origem: string;
      observacoes?: string;
      ctx: HttpContextContract;
    };
  }
}
