import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import {
  column,
  beforeSave,
  BaseModel,
  HasOne,
  hasOne,
  scope,
} from "@ioc:Adonis/Lucid/Orm";
import ApiError from "App/Exceptions/ApiError";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public nome: string;

  @column()
  public status: number;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberMeToken: string | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column.dateTime()
  public deletedAt: DateTime | null;

  @column()
  public deletedBy: number;

  @hasOne(() => User)
  public deletedByUser: HasOne<typeof User>;

  @beforeSave()
  public static async beforeSave(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }

    // valida email ao editar
    if (user.$dirty.email) {
      const query = User.query().where("email", user.email);
      if (user.id) {
        query.whereNot("id", user.id);
      }

      const userWithEmail = await query.first();

      if (userWithEmail) {
        throw new ApiError(
          "Este e-mail já está sendo utilizado por outro usuário",
          400
        );
      }
    }
  }

  public static ativo = scope((query) => {
    query.where("status", ">", 0);
  });
}
