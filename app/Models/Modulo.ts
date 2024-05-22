import { BaseModel, HasMany, column, hasMany } from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import Permissao from "./Permissao";

export default class Modulo extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public nome: string;

  @hasMany(() => Permissao)
  public tiposPermissoes: HasMany<typeof Permissao>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
