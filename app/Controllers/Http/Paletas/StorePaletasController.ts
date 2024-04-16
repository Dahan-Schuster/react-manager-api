import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { regexHexColor } from "App/Enums/Rules";
import { defaultValidationMessages } from "App/Enums/ValidationMessages";
import PaletaCoresSistema from "App/Models/PaletaCoresSistema";

export default class StorePaletasController {
  public async handle({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      nome: schema.string.optional([
        rules.unique({ table: "paletas_cores_sistema", column: "nome" }),
      ]),
      main: schema.string({ trim: true }, [regexHexColor]),
      dark: schema.string.optional({ trim: true }, [regexHexColor]),
      light: schema.string.optional({ trim: true }, [regexHexColor]),
      contrastText: schema.string.optional({ trim: true }, [regexHexColor]),
      "100": schema.string.optional({ trim: true }, [regexHexColor]),
      "200": schema.string.optional({ trim: true }, [regexHexColor]),
      "300": schema.string.optional({ trim: true }, [regexHexColor]),
      "400": schema.string.optional({ trim: true }, [regexHexColor]),
      "500": schema.string.optional({ trim: true }, [regexHexColor]),
      "600": schema.string.optional({ trim: true }, [regexHexColor]),
      "700": schema.string.optional({ trim: true }, [regexHexColor]),
    });

    const data = await request.validate({
      schema: validationSchema,
      messages: defaultValidationMessages,
    });

    const paleta = await PaletaCoresSistema.create(data);

    response.send({
      success: true,
      paleta: paleta.toJSON(),
    });
  }
}
