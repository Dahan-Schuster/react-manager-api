import {
  BaseModel,
  ManyToMany,
  column,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import { DateTime } from "luxon";
import PaletaCoresSistema from "./PaletaCoresSistema";
import CoresMui from "App/Enums/CoresMui";
import { ModelObject } from "@ioc:Adonis/Lucid/Orm";

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

  @column({ serialize: (value) => value || undefined })
  public backgroundDefault: string;

  @column({ serialize: (value) => value || undefined })
  public backgroundPaper: string;

  @column({ serialize: (value) => value || undefined })
  public textPrimary: string;

  @column({ serialize: (value) => value || undefined })
  public textSecondary: string;

  @column({ serialize: (value) => value || undefined })
  public textDisabled: string;

  @column({ serialize: (value) => value || undefined })
  public corHeader: string;

  @column({ serialize: (value) => value || undefined })
  public corTextoHeader: string;

  @column({ serialize: (value) => value || undefined })
  public corMenu: string;

  @column({ serialize: (value) => value || undefined })
  public corTextoMenu: string;

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

  public static async inativarOutrosTemas(tema: TemaMuiSistema) {
    await TemaMuiSistema.query()
      .where("id", "!=", tema.id)
      .andWhere("muiMode", tema.muiMode)
      .update({ ativo: 0 });
  }

  public static async getAtivo(mode: MUI.MuiMode) {
    const tema = await TemaMuiSistema.query()
      .preload("paletasCores")
      .where("ativo", true)
      .andWhere("mui_mode", mode)
      .first();
    if (!tema) return null;
    return { ...TemaMuiSistema.formatarPaletas(tema), paletasCores: undefined };
  }

  public static formatarPaletas(
    tema: TemaMuiSistema
  ): ModelObject & { coresMui?: Record<CoresMui, TemaMuiSistema> } {
    return {
      ...tema.toJSON(),
      coresMui: tema.paletasCores?.reduce((acc, paleta) => {
        acc[paleta.$extras.pivot_nome_prop_mui] = paleta.serialize({
          fields: {
            omit: ["created_at", "updated_at", "nome", "id"],
          },
        });
        return acc;
      }, {} as Record<CoresMui, TemaMuiSistema>),
    };
  }
}
