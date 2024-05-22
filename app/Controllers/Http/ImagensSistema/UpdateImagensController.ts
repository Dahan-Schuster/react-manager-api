import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { rules, schema } from "@ioc:Adonis/Core/Validator";
import ImagemSistema from "App/Models/ImagemSistema";
import UploadImagem from "App/Services/UploadImagem";

export default class UpdateImagensController {
  public async handle({ request, response }: HttpContextContract) {
    const id = request.param("id");

    const validationSchema = schema.create({
      nomeImagem: schema.string.optional({ trim: true }),
      file: schema.file({ size: "2mb", extnames: ["png", "jpg", "jpeg"] }),
    });

    const { file, nomeImagem } = await request.validate({
      schema: validationSchema,
    });

    const imagem = await ImagemSistema.findOrFail(id);
    await UploadImagem.delete(imagem.url.replace("public", ""));
    const url = await UploadImagem.upload(
      file,
      { name: nomeImagem },
      "imagens"
    );
    await imagem.merge({ url }).save();

    response.send({
      success: true,
      imagem: imagem.toJSON(),
    });
  }
}
