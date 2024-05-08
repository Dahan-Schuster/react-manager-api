import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { CoresMui, VariantesCor } from "App/Enums/CoresMui";
import ApiError from "App/Exceptions/ApiError";
import { DateTime } from "luxon";

export type CorPaleta = {
  main: string;
  light?: string;
  dark?: string;
  contrastText?: string;
};

export type CoresPaleta = Record<string, CorPaleta>;

export default class TemaMuiSistema extends BaseModel {
  public static table = "temas_mui_sistema";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public nome: string | null;

  @column()
  public ativo: 0 | 1;

  @column()
  public mui_mode: MUI.MuiMode;

  @column()
  public url_favicon: string;

  @column()
  public url_logo_header: string;

  @column()
  public url_logo_login: string;

  @column()
  public url_logo_simples: string;

  @column({ serialize: (value) => value || undefined })
  public background_default: string;

  @column({ serialize: (value) => value || undefined })
  public background_paper: string;

  @column({ serialize: (value) => value || undefined })
  public text_primary: string;

  @column({ serialize: (value) => value || undefined })
  public text_secondary: string;

  @column({ serialize: (value) => value || undefined })
  public text_disabled: string;

  @column({ serialize: (value) => value || undefined })
  public cor_header: string;

  @column({ serialize: (value) => value || undefined })
  public cor_texto_header: string;

  @column({ serialize: (value) => value || undefined })
  public cor_menu: string;

  @column({ serialize: (value) => value || undefined })
  public cor_texto_menu: string;

  @column({ serialize: (value) => value || undefined })
  public cores_paleta: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  public static async inativarOutrosTemas(tema: TemaMuiSistema) {
    await TemaMuiSistema.query()
      .where("id", "!=", tema.id)
      .andWhere("mui_mode", tema.mui_mode)
      .update({ ativo: 0 });
  }

  public static async getAtivo(mode: MUI.MuiMode) {
    const tema = await TemaMuiSistema.query()
      .where("ativo", true)
      .andWhere("mui_mode", mode)
      .first();
    if (!tema) return null;
    return tema;
  }

  public static validarCoresPaleta(coresPaletaJSON: string) {
    let coresPaleta: CoresPaleta | null;
    try {
      coresPaleta = JSON.parse(coresPaletaJSON) as CoresPaleta;
    } catch {
      throw new ApiError(
        "coresPaleta: Objeto de paleta de cores inválido",
        400
      );
    }

    if (!coresPaleta || Object.keys(coresPaleta).length === 0)
      throw new ApiError(
        "coresPaleta: Objeto de paleta de cores inválido",
        400
      );

    const nomesCores = Object.keys(CoresMui);
    const variantesCores = Object.keys(VariantesCor);

    for (const key in coresPaleta) {
      if (!nomesCores.includes(key))
        throw new ApiError(
          `coresPaleta: Cor ${key} não faz parte das paletas MUI`,
          400
        );

      const cor = coresPaleta[key];
      if (!cor.main)
        throw new ApiError(
          `coresPaleta: Valor main faltante na cor ${key}`,
          400
        );

      for (const varianteCor in cor) {
        if (!variantesCores.includes(varianteCor))
          throw new ApiError(
            `coresPaleta: Variante ${varianteCor} não faz parte das variantes MUI`,
            400
          );
        if (/^#[0-9A-F]{6}$/i.test(cor[varianteCor]) === false)
          throw new ApiError(
            `coresPaleta: Valor ${varianteCor} inválido na cor ${key}`,
            400
          );
      }
    }
  }
}
