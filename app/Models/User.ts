import Hash from "@ioc:Adonis/Core/Hash";
import {
  BaseModel,
  BelongsTo,
  HasOne,
  ManyToMany,
  beforeSave,
  belongsTo,
  column,
  hasOne,
  manyToMany,
  scope,
} from "@ioc:Adonis/Lucid/Orm";
import ApiError from "App/Exceptions/ApiError";
import { DateTime } from "luxon";
import Perfil from "./Perfil";
import Permissao from "./Permissao";

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

  @hasOne(() => User, {
    foreignKey: "id",
    localKey: "deletedBy",
  })
  public deletedByUser: HasOne<typeof User>;

  @column()
  public perfilId: number | null;

  @belongsTo(() => Perfil)
  public perfil: BelongsTo<typeof Perfil>;

  @manyToMany(() => Permissao, {
    pivotTable: "permissoes_usuarios",
    pivotForeignKey: "user_id",
    pivotRelatedForeignKey: "permissao_id",
    pivotColumns: ["permissao_fixada"],
    pivotTimestamps: true,
    onQuery(query) {
      query.pivotColumns(["permissao_fixada"]);
    },
  })
  public permissoes: ManyToMany<typeof Permissao>;

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

  @beforeSave()
  public static async atualizarPermissoes(user: User) {
    // se não alterou o perfil, não faz nada
    if (user.$dirty.perfilId === undefined) {
      return;
    }

    // se o usuário possuia um perfil anterior...
    const perfilOriginal = await Perfil.find(user.$original.perfilId);
    if (perfilOriginal) {
      // busca as permissões relacionadas ao antigo perfil do usuário
      const permissoesPerfilOriginal = await perfilOriginal
        ?.related("permissoes")
        .query()
        .select("id");
      const idsPermissoesPerfilOriginal = permissoesPerfilOriginal?.map(
        (p) => p.id
      );

      // filtra as permissões do usuário que foram herdadas pelo perfil (não fixadas)
      const permissoesPerfilUsuario = await user
        .related("permissoes")
        .query()
        .whereInPivot("permissao_id", idsPermissoesPerfilOriginal)
        .andWherePivot("permissao_fixada", 0)
        .select("id");
      const idsPermissoesPerfilUsuario = permissoesPerfilUsuario?.map(
        (p) => p.id
      );

      // remove as permissões herdadas pelo perfil antigo, se houverem
      if (idsPermissoesPerfilUsuario?.length) {
        await user.related("permissoes").detach(idsPermissoesPerfilUsuario);
      }
    }

    // se apenas removeu o perfil, não precisa adicionar permissões
    if (!user.perfilId) return;

    const perfil = await Perfil.find(user.perfilId);
    if (!perfil) return;

    // busca as permissões do novo perfil
    const permissoesNovoPerfil = await perfil
      .related("permissoes")
      .query()
      .select("id");
    const idsPermissoesNovoPerfil = permissoesNovoPerfil?.map((p) => p.id);

    // busca as permissões do perfil que já foram fixadas no usuário
    const permissoesFixadas = await user
      .related("permissoes")
      .query()
      .whereInPivot("permissao_id", idsPermissoesNovoPerfil)
      .andWherePivot("permissao_fixada", 1)
      .select("id");
    const idsPermissoesFixadas = permissoesFixadas?.map((p) => p.id);

    // filtra as permissões que devem ser herdadas (não foram fixadas anteriormente)
    const idsPermissoesHerdadas = idsPermissoesNovoPerfil.filter(
      (p) => !idsPermissoesFixadas?.includes(p)
    );

    // adiciona as permissões herdadas ao usuário, se houverem
    if (idsPermissoesHerdadas?.length) {
      await user.related("permissoes").attach(idsPermissoesHerdadas);
    }
  }

  public static ativo = scope((query) => {
    query.where("status", ">", 0);
  });
}
