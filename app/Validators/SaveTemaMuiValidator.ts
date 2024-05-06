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
    ativo: schema.boolean.optional(this.requiredRules),
    muiMode: schema.enum.optional(["light", "dark"], this.requiredRules),

    fileFavicon: schema.file.optional(
      { size: "1mb", extnames: ["ico"] },
      this.requiredRules
    ),
    fileLogoHeader: schema.file.optional(opcoesImagemTema, this.requiredRules),
    fileLogoLogin: schema.file.optional(opcoesImagemTema),
    fileLogoSimples: schema.file.optional(opcoesImagemTema),

    backgroundDefault: schema.string.optional({ trim: true }, [regexHexColor]),
    backgroundPaper: schema.string.optional({ trim: true }, [regexHexColor]),
    textPrimary: schema.string.optional({ trim: true }, [regexHexColor]),
    textSecondary: schema.string.optional({ trim: true }, [regexHexColor]),
    textDisabled: schema.string.optional({ trim: true }, [regexHexColor]),
    corHeader: schema.string.optional({ trim: true }, [regexHexColor]),
    corTextoHeader: schema.string.optional({ trim: true }, [regexHexColor]),
    corMenu: schema.string.optional({ trim: true }, [regexHexColor]),
    corTextoMenu: schema.string.optional({ trim: true }, [regexHexColor]),

    coresPaleta: schema.string.optional(),
  });

  public messages: CustomMessages = defaultValidationMessages;
}
