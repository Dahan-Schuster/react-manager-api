import Env from "@ioc:Adonis/Core/Env";
import type { CustomMessages } from "@ioc:Adonis/Core/Validator";

const minPasswordLength = Env.get("MIN_PASSWORD_LENGTH");

export const defaultValidationMessages: CustomMessages = {
  "nome.unique": "Registro com mesmo nome já cadastrado",
  "email.unique": "Registro com mesmo e-mail já cadastrado",
  exists: "{{ field }} inválido",
  required: "{{ field }} é obrigatório",
  regex: "campo {{ field }} não está no formato de texto esperado",
};

export const userValidationMessages: CustomMessages = {
  "nome.required": "Nome é obrigatório",
  "email.required": "Email é obrigatório",
  "email.email": "Email inválido",
  "perfilId.required": "Perfil é obrigatório",
  "password.required": "Senha é obrigatória",
  "password.confirmed": "As senhas não coincidem",
  "password_confirmation.confirmed": "As senhas não coincidem",
  "password.minLength": `A senha deve ter pelo menos ${minPasswordLength} caracteres`,
  exists: "{{ field }} inválido",
};
