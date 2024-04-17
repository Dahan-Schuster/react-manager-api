import type { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import UploadImagem from "App/Services/UploadImagem";
import { DateTime } from "luxon";

export default class ImagemSistema extends BaseModel {
  public static table = "imagens_sistema";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public url: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  public static async uploadAndCreate(
    file: MultipartFileContract,
    nomeImagem?: string
  ) {
    const url = await UploadImagem.upload(
      file,
      { name: nomeImagem },
      "imagens"
    );
    const imagem = await ImagemSistema.create({ url });
    return imagem;
  }

  public static async findOrUploadAndCreate(
    id?: number,
    file?: MultipartFileContract,
    nome?: string
  ) {
    let imagem: ImagemSistema;
    if (id) {
      imagem = await ImagemSistema.findOrFail(id);
    } else {
      imagem = await ImagemSistema.uploadAndCreate(file!, nome);
    }

    return imagem;
  }
}
