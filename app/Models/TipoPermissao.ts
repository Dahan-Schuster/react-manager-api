import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Permissao from "./Permissao";

export default class TipoPermissao extends BaseModel {
  public static table = "tipos_permissoes";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public nome: string;

  @hasMany(() => Permissao)
  public permissoes: HasMany<typeof Permissao>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
