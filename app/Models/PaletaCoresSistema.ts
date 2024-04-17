import { DateTime } from "luxon";
import {
  BaseModel,
  ManyToMany,
  column,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import TemaMuiSistema from "./TemaMuiSistema";

export default class PaletaCoresSistema extends BaseModel {
  public static table = "paletas_cores_sistema";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public nome: string | null;

  @column()
  public main: string;

  @column()
  public dark: string | null;

  @column()
  public light: string | null;

  @column()
  public "100": string | null;

  @column()
  public "200": string | null;

  @column()
  public "300": string | null;

  @column()
  public "400": string | null;

  @column()
  public "500": string | null;

  @column()
  public "600": string | null;

  @column()
  public "700": string | null;

  @column({ columnName: "contrastText" })
  public contrastText: string | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @manyToMany(() => TemaMuiSistema, {
    pivotForeignKey: "paleta_cores_id",
    pivotRelatedForeignKey: "tema_mui_id",
    pivotTable: "temas_mui_paletas_sistema",
    pivotColumns: ["nome_prop_mui"],
    onQuery(query) {
      query.pivotColumns(["nome_prop_mui"]);
    },
  })
  public temasMui: ManyToMany<typeof TemaMuiSistema>;
}
