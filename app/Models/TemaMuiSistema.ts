import {
  BaseModel,
  ManyToMany,
  column,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
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
  public muiMode: MUI.MuiMode;

  @column()
  public urlFavicon: string;

  @column()
  public urlLogoHeader: string;

  @column()
  public urlLogoLogin: string;

  @column()
  public urlLogoSimples: string;

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

  public static async inativarOutrosTemas(id: number) {
    await TemaMuiSistema.query().where("id", "!=", id).update({ ativo: 0 });
  }
}
