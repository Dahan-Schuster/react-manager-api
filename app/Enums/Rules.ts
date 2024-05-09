import { rules } from "@ioc:Adonis/Core/Validator";
import type { Rule } from "@ioc:Adonis/Core/Validator";
import type { FileValidationOptions } from "@ioc:Adonis/Core/BodyParser";

export const regexHexColor: Rule = rules.regex(/^#[0-9A-F]{6}$/i);

export const opcoesImagemTema: FileValidationOptions = {
  size: "2mb",
  extnames: ["png", "jpg", "jpeg"],
};
