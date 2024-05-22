import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  belongsTo,
  column,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import TipoPermissao from "./TipoPermissao";
import Modulo from "./Modulo";
import User from "./User";
import Perfil from "./Perfil";
import MenuItem from "./MenuItem";

export default class Permissao extends BaseModel {
  public static table = "permissoes";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public label: string;

  @column()
  public slug: string;

  @column()
  public tipoId: number;

  @belongsTo(() => TipoPermissao)
  public tipo: BelongsTo<typeof TipoPermissao>;

  @column()
  public moduloId: number;

  @belongsTo(() => Modulo)
  public modulo: BelongsTo<typeof Modulo>;

  @manyToMany(() => User, {
    pivotTable: "permissoes_usuarios",
    pivotForeignKey: "permissao_id",
    pivotRelatedForeignKey: "user_id",
    pivotColumns: ["permissao_fixada"],
    pivotTimestamps: true,
  })
  public users: ManyToMany<typeof User>;

  @manyToMany(() => Perfil, {
    pivotTable: "permissoes_perfis",
    pivotForeignKey: "permissao_id",
    pivotRelatedForeignKey: "perfil_id",
    pivotTimestamps: true,
  })
  public perfis: ManyToMany<typeof Perfil>;

  @manyToMany(() => MenuItem, {
    pivotTable: "permissoes_menu_itens",
    pivotForeignKey: "permissao_id",
    pivotRelatedForeignKey: "menu_item_id",
    pivotTimestamps: true,
  })
  public menuItens: ManyToMany<typeof MenuItem>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
