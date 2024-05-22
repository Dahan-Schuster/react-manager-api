import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import ImagemSistema from "App/Models/ImagemSistema";

export default class StoreImagensController {
  public async handle({ request, response }: HttpContextContract) {
    const validationSchema = schema.create({
      nomeImagem: schema.string.optional({ trim: true }),
      file: schema.file({ size: "2mb", extnames: ["png", "jpg", "jpeg"] }),
    });

    const { file, nomeImagem } = await request.validate({
      schema: validationSchema,
    });

    const imagem = await ImagemSistema.uploadAndCreate(file, nomeImagem);
    response.send({
      success: true,
      imagem: imagem.toJSON(),
    });
  }
}
