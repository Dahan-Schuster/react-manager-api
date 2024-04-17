import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import ApiError from "App/Exceptions/ApiError";
import TemaMuiSistema from "App/Models/TemaMuiSistema";
import UploadImagem from "App/Services/UploadImagem";
import SaveTemaMuiValidator from "App/Validators/SaveTemaMuiValidator";

export default class UpdateTemasController {
  public async handle({ request, response }: HttpContextContract) {
    if (!request.input("id")) {
      throw new ApiError("Campo ID é obrigatório", 400);
    }

    const {
      id,
      nome,
      muiMode,
      fileFavicon,
      fileLogoHeader,
      fileLogoLogin,
      fileLogoSimples,
      ...idsPaletasCores
    } = await request.validate(SaveTemaMuiValidator);

    await Database.transaction(async (trx) => {
      const tema = await TemaMuiSistema.findOrFail(id);
      tema.useTransaction(trx);

      tema.merge({ nome, muiMode: muiMode as MUI.MuiMode });

      if (fileFavicon) {
        await UploadImagem.delete(tema.urlFavicon);
        tema.urlFavicon = await UploadImagem.upload(fileFavicon, {
          name: `favicon-tema-${tema.nome}`,
        });
      }

      if (fileLogoHeader) {
        await UploadImagem.delete(tema.urlLogoHeader);
        tema.urlLogoHeader = await UploadImagem.upload(fileLogoHeader, {
          name: `logoHeader-tema-${tema.nome}`,
        });
      }

      if (fileLogoLogin) {
        await UploadImagem.delete(tema.urlLogoLogin);
        tema.urlLogoLogin = await UploadImagem.upload(fileLogoLogin, {
          name: `logoLogin-tema-${tema.nome}`,
        });
      } else {
        tema.urlLogoLogin = tema.urlLogoHeader;
      }

      if (fileLogoSimples) {
        await UploadImagem.delete(tema.urlLogoSimples);
        tema.urlLogoSimples = await UploadImagem.upload(fileLogoSimples, {
          name: `logoSimples-tema-${tema.nome}`,
        });
      } else {
        tema.urlLogoSimples = tema.urlLogoHeader;
      }

      try {
        await tema.save();

        // relaciona os ids das paletas de cores ao tema,
        // definido a coluna nome_prop_mui de acordo com o
        // nome da cor no MUI
        if (Object.keys(idsPaletasCores).length > 0) {
          await tema.related("paletasCores").detach();
          await tema.related("paletasCores").attach(
            Object.keys(idsPaletasCores).reduce((acc, nomeCorMui) => {
              const id = idsPaletasCores[nomeCorMui];
              acc[id] = {
                nome_prop_mui: nomeCorMui,
              };
              return acc;
            }, {})
          );
        }
      } catch (e) {
        trx.rollback();
        // deleta imagens do disco caso a transação falhe
        await Promise.all([
          UploadImagem.delete(tema.urlFavicon),
          UploadImagem.delete(tema.urlLogoHeader),
          UploadImagem.delete(tema.urlLogoLogin),
          UploadImagem.delete(tema.urlLogoSimples),
        ]);
        throw e;
      }

      response.send({
        success: true,
        tema,
      });
    });
  }
}
