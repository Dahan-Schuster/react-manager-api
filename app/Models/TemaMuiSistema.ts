import {
  BaseModel,
  HasOne,
  ManyToMany,
  column,
  hasOne,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import ImagemSistema from "./ImagemSistema";
import PaletaCoresSistema from "./PaletaCoresSistema";

export default class TemaMuiSistema extends BaseModel {
  public static table = "temas_mui_sistema";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public nome: string | null;

  @column()
  public ativo: 0 | 1;

  @column()
  public muiMode: "light" | "dark";

  @column()
  public urlFavicon: string;

  @column()
  public idLogoHeader: number;

  @hasOne(() => ImagemSistema)
  public logoHeader: HasOne<typeof ImagemSistema>;

  @column()
  public idLogoLogin: number | null;

  @hasOne(() => ImagemSistema)
  public logoLogin: HasOne<typeof ImagemSistema>;

  @column()
  public idLogoSimples: number | null;

  @hasOne(() => ImagemSistema)
  public logoSimples: HasOne<typeof ImagemSistema>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @manyToMany(() => PaletaCoresSistema, {
    pivotForeignKey: "tema_mui_id",
    pivotRelatedForeignKey: "paleta_cores_id",
    pivotTable: "temas_mui_paletas_sistema",
    pivotColumns: ["nome_prop_mui"],
    onQuery(query) {
      query.pivotColumns(["nome_prop_mui"]);
    },
  })
  public paletasCores: ManyToMany<typeof PaletaCoresSistema>;
}
