import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";

export default class DatabaseLog extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public modulo: string;

  @column()
  public operacao: string;

  @column()
  public origem: string;

  @column()
  public observacoes: string | null;

  @column()
  public request_id: string | null;

  @column({
    serialize: (value) => {
      if (!value) return undefined;

      if (typeof value === "string") {
        return JSON.parse(value);
      }

      return value;
    },
  })
  public dados: string | null;

  @column()
  public user_id: number | null;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
