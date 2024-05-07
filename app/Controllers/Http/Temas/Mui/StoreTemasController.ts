import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import TemaMuiSistema from "App/Models/TemaMuiSistema";
import UploadImagem from "App/Services/UploadImagem";
import SaveTemaMuiValidator from "App/Validators/SaveTemaMuiValidator";

export default class StoreTemasController {
  public async handle({ request, response }: HttpContextContract) {
    const dados = await request.validate(SaveTemaMuiValidator);
    const {
      nome,
      ativo,
      mui_mode,
      file_favicon: fileFavicon,
      file_logo_header: fileLogoHeader,
      file_logo_login: fileLogoLogin,
      file_logo_simples: fileLogoSimples,
      cores_paleta,
      ...dadosExtra
    } = dados;

    cores_paleta && TemaMuiSistema.validarCoresPaleta(cores_paleta);

    await Database.transaction(async (trx) => {
      const [url_favicon, url_logo_header] = await Promise.all([
        await UploadImagem.upload(fileFavicon!, {
          name: `favicon-tema-${nome}`,
        }),
        await UploadImagem.upload(fileLogoHeader!, {
          name: `logoHeader-tema-${nome}`,
        }),
      ]);

      let url_logo_login = url_logo_header;
      if (fileLogoLogin) {
        url_logo_login = await UploadImagem.upload(fileLogoLogin, {
          name: `logoLogin-tema-${nome}`,
        });
      }

      let url_logo_simples = url_logo_header;
      if (fileLogoSimples) {
        url_logo_simples = await UploadImagem.upload(fileLogoSimples, {
          name: `logoSimples-tema-${nome}`,
        });
      }

      const tema = new TemaMuiSistema();
      tema.useTransaction(trx);
      try {
        tema.fill({
          nome,
          ativo: ativo ? 1 : 0,
          mui_mode: mui_mode as MUI.MuiMode,
          url_logo_header,
          url_favicon,
          url_logo_login,
          url_logo_simples,
          cores_paleta,
          ...dadosExtra,
        });

        await tema.save();

        // se ativar o tema, inativa os demais
        if (ativo) {
          await TemaMuiSistema.inativarOutrosTemas(tema);
        }
      } catch (e) {
        trx.rollback();
        // deleta imagens do disco caso a transação falhe
        await Promise.all([
          UploadImagem.delete(url_favicon),
          UploadImagem.delete(url_logo_header),
          UploadImagem.delete(url_logo_login),
          UploadImagem.delete(url_logo_simples),
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
