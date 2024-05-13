import type { EventsList } from "@ioc:Adonis/Core/Event";
import DatabaseLog from "App/Models/DatabaseLog";

export default class User {
  public async onNewUser({
    user,
    origem,
    observacoes,
    ctx,
  }: EventsList["new:user"]) {
    ctx.logger.info(`Novo usuário criado: #${user.id} - ${user.email}`);
    const databaseLog = new DatabaseLog();
    databaseLog
      .fill({
        evento: "new:user",
        origem,
        dados: JSON.stringify(user),
        user_id: ctx.auth?.user?.id,
        observacoes,
      })
      .save();
  }
}
