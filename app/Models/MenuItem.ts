import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  HasMany,
  ManyToMany,
  belongsTo,
  column,
  hasMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";

import { compose } from "@ioc:Adonis/Core/Helpers";
import { AutoPreload } from "@ioc:Adonis/Addons/AutoPreload";

import Permissao from "./Permissao";

export default class MenuItem extends compose(BaseModel, AutoPreload) {
  public static table = "menu_itens";

  public static $with = ["children"] as const;

  @column({ isPrimary: true })
  public id: number;

  @column()
  public label: string;

  @column()
  public url: string | null;

  @column()
  public target: string;

  @column()
  public icone: string | null;

  @column({ serialize: (value) => Boolean(value) })
  public ativo: boolean;

  @column({ serialize: (value) => Boolean(value) })
  public publico: boolean;

  @column()
  public ordem: number;

  @column()
  public parent_id: number | null;

  @belongsTo(() => MenuItem, {
    foreignKey: "parent_id",
  })
  public parent: BelongsTo<typeof MenuItem>;

  @hasMany(() => MenuItem, {
    foreignKey: "parent_id",
  })
  public children: HasMany<typeof MenuItem>;

  @manyToMany(() => Permissao, {
    pivotTable: "permissoes_menu_itens",
    pivotForeignKey: "menu_item_id",
    pivotRelatedForeignKey: "permissao_id",
    pivotTimestamps: true,
  })
  public permissoes: ManyToMany<typeof Permissao>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
