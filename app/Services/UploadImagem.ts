import type { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import type { ContentHeaders } from "@ioc:Adonis/Core/Drive";
import Drive from "@ioc:Adonis/Core/Drive";
import randomstring from "randomstring";
import StringTools from "./StringTools";

export default class UploadImagem {
  public static async upload(
    file: MultipartFileContract,
    opcoes: {
      visibility?: string | undefined;
    } & ContentHeaders &
      Record<string, any> & {
        name?: string | undefined;
      } = {},
    pasta = ""
  ) {
    const fileName = opcoes.name || file.clientName;
    opcoes.name = `${randomstring.generate(10)}_${StringTools.slugify(
      fileName.split(".")[0]
    )}.${file.extname}`;

    if (!opcoes.visibility) {
      opcoes.visibility = "public";
    }

    await file.moveToDisk(pasta, opcoes);
    return Drive.getUrl(pasta + "/" + opcoes.name);
  }

  public static async delete(filePath: string) {
    if (filePath.startsWith("public")) {
      filePath = filePath.replace("public", "");
    }
    await Drive.delete(filePath);
  }
}
