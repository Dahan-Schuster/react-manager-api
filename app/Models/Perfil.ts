import { DateTime } from "luxon";
import {
  BaseModel,
  ManyToMany,
  column,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Permissao from "./Permissao";

export default class Perfil extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public nome: string;

  @manyToMany(() => Permissao, {
    pivotTable: "permissoes_perfis",
    pivotForeignKey: "perfil_id",
    pivotRelatedForeignKey: "permissao_id",
    pivotTimestamps: true,
  })
  public permissoes: ManyToMany<typeof Permissao>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
