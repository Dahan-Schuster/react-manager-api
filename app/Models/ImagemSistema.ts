import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class ImagemSistema extends BaseModel {
  public static table = "imagens_sistema";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public url: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}