import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import { BaseModel, beforeSave, column } from "@ioc:Adonis/Lucid/Orm";

export default class RecoveryToken extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column()
  public token: string;

  @column.dateTime({ autoCreate: true })
  public expiresAt: DateTime;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashToken(token: RecoveryToken) {
    if (token.$dirty.token) {
      token.token = await Hash.make(token.token);
    }
  }
}
