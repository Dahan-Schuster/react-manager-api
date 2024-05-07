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
      mui_mode,
      file_favicon: fileFavicon,
      file_logo_header: fileLogoHeader,
      file_logo_login: fileLogoLogin,
      file_logo_simples: fileLogoSimples,
      background_default,
      background_paper,
      text_primary,
      text_secondary,
      text_disabled,
      cor_menu,
      cor_texto_header,
      cor_header,
      cor_texto_menu,
      cores_paleta,
    } = await request.validate(SaveTemaMuiValidator);

    cores_paleta && TemaMuiSistema.validarCoresPaleta(cores_paleta);

    await Database.transaction(async (trx) => {
      const tema = await TemaMuiSistema.findOrFail(id);
      tema.useTransaction(trx);

      let nomeTema = nome || tema.nome;

      tema.merge({
        nome,
        mui_mode: mui_mode as MUI.MuiMode,
        background_default,
        background_paper,
        text_primary,
        text_secondary,
        text_disabled,
        cor_menu,
        cor_texto_header,
        cor_header,
        cor_texto_menu,
        cores_paleta,
      });

      if (fileFavicon) {
        await UploadImagem.delete(tema.url_favicon);
        tema.url_favicon = await UploadImagem.upload(fileFavicon, {
          name: `favicon-tema-${nomeTema}`,
        });
      }

      if (fileLogoHeader) {
        await UploadImagem.delete(tema.url_logo_header);
        tema.url_logo_header = await UploadImagem.upload(fileLogoHeader, {
          name: `logoHeader-tema-${nomeTema}`,
        });
      }

      if (fileLogoLogin) {
        await UploadImagem.delete(tema.url_logo_login);
        tema.url_logo_login = await UploadImagem.upload(fileLogoLogin, {
          name: `logoLogin-tema-${nomeTema}`,
        });
      } else {
        tema.url_logo_login = tema.url_logo_header;
      }

      if (fileLogoSimples) {
        await UploadImagem.delete(tema.url_logo_simples);
        tema.url_logo_simples = await UploadImagem.upload(fileLogoSimples, {
          name: `logoSimples-tema-${nomeTema}`,
        });
      } else {
        tema.url_logo_simples = tema.url_logo_header;
      }

      try {
        await tema.save();
      } catch (e) {
        trx.rollback();
        // deleta imagens do disco caso a transação falhe
        await Promise.all([
          UploadImagem.delete(tema.url_favicon),
          UploadImagem.delete(tema.url_logo_header),
          UploadImagem.delete(tema.url_logo_login),
          UploadImagem.delete(tema.url_logo_simples),
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
