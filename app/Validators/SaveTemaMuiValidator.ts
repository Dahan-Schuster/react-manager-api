import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import {
  CustomMessages,
  Rule,
  rules,
  schema,
} from "@ioc:Adonis/Core/Validator";
import { opcoesImagemTema, regexHexColor } from "App/Enums/Rules";
import { defaultValidationMessages } from "App/Enums/ValidationMessages";

export default class SaveTemaMuiValidator {
  protected requiredRules: Rule[] = [rules.requiredIfNotExists("id")];

  constructor(_ctx: HttpContextContract) {}

  public schema = schema.create({
    id: schema.number.optional(),
    nome: schema.string.optional({ trim: true }, this.requiredRules),
    ativo: schema.boolean.optional(),
    mui_mode: schema.enum.optional(["light", "dark"], this.requiredRules),

    file_favicon: schema.file.optional(
      { size: "500kb", extnames: ["ico"] },
      this.requiredRules
    ),
    file_logo_header: schema.file.optional(
      opcoesImagemTema,
      this.requiredRules
    ),
    file_logo_login: schema.file.optional(opcoesImagemTema),
    file_logo_simples: schema.file.optional(opcoesImagemTema),

    background_default: schema.string.optional({ trim: true }, [regexHexColor]),
    background_paper: schema.string.optional({ trim: true }, [regexHexColor]),
    text_primary: schema.string.optional({ trim: true }, [regexHexColor]),
    text_secondary: schema.string.optional({ trim: true }, [regexHexColor]),
    text_disabled: schema.string.optional({ trim: true }, [regexHexColor]),
    cor_header: schema.string.optional({ trim: true }, [regexHexColor]),
    cor_texto_header: schema.string.optional({ trim: true }, [regexHexColor]),
    cor_menu: schema.string.optional({ trim: true }, [regexHexColor]),
    cor_texto_menu: schema.string.optional({ trim: true }, [regexHexColor]),

    cores_paleta: schema.string.optional(),
  });

  public messages: CustomMessages = {
    ...defaultValidationMessages,
    "file_favicon.size":
      "O tamanho do favicon deve ser no máximo {{ options.size }}",
    "file_favicon.extname":
      "Tipo de arquivo inválido para favicon. Tipo esperado: {{ extnames }}",
    "file.size":
      "O tamanho da imagem de logo deve ser no máximo {{ options.size }}",
    "file.extname":
      "Tipo de arquivo inválido para a imagem de logo. Tipo esperado: {{ options.extnames }}",
  };
}
