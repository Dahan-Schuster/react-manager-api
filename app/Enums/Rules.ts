import { rules } from "@ioc:Adonis/Core/Validator";
import type { Rule } from "@ioc:Adonis/Core/Validator";

export const regexHexColor: Rule = rules.regex(/^#[0-9A-F]{6}$/i);
