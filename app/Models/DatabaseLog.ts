import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import { AutoPreload } from "@ioc:Adonis/Addons/AutoPreload";
import { compose } from "@ioc:Adonis/Core/Helpers";

export default class DatabaseLog extends compose(BaseModel, AutoPreload) {
  public static $with = ["user"] as const;

  @column({ isPrimary: true })
  public id: number;

  @column()
  public evento: string;

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
  public userId: number | null;

  @belongsTo(() => User, {
    onQuery: (query) => {
      query.select("id", "nome");
    },
  })
  public user: BelongsTo<typeof User>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
