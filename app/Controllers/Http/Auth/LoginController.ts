import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import ApiError from "App/Exceptions/ApiError";

export default class LoginController {
  public async handle({ auth, response, request }: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string({ escape: true, trim: true }),
      password: schema.string(),
    });

    const { email, password } = await request.validate({
      schema: validationSchema,
    });

    try {
      const token = await auth.use("jwt").attempt(email, password);
      return response.send({
        success: true,
        token,
        user: auth.user?.serialize(),
      });
    } catch (e) {
      if (e?.constructor?.name === "InvalidCredentialsException") {
        throw new ApiError("Email ou senha inválidos", 400);
      }
    }
  }
}
