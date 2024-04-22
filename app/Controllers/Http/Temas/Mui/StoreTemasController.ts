import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import TemaMuiSistema from "App/Models/TemaMuiSistema";
import UploadImagem from "App/Services/UploadImagem";
import SaveTemaMuiValidator from "App/Validators/SaveTemaMuiValidator";

export default class StoreTemasController {
  public async handle({ request, response }: HttpContextContract) {
    const {
      nome,
      ativo,
      muiMode,
      fileFavicon,
      fileLogoHeader,
      fileLogoLogin,
      fileLogoSimples,
      backgroundDefault,
      backgroundPaper,
      textPrimary,
      textSecondary,
      textDisabled,
      ...idsPaletasCores
    } = await request.validate(SaveTemaMuiValidator);

    await Database.transaction(async (trx) => {
      const [urlFavicon, urlLogoHeader] = await Promise.all([
        await UploadImagem.upload(fileFavicon!, {
          name: `favicon-tema-${nome}`,
        }),
        await UploadImagem.upload(fileLogoHeader!, {
          name: `logoHeader-tema-${nome}`,
        }),
      ]);

      let urlLogoLogin = urlLogoHeader;
      if (fileLogoLogin) {
        urlLogoLogin = await UploadImagem.upload(fileLogoLogin, {
          name: `logoLogin-tema-${nome}`,
        });
      }

      let urlLogoSimples = urlLogoHeader;
      if (fileLogoSimples) {
        urlLogoSimples = await UploadImagem.upload(fileLogoSimples, {
          name: `logoSimples-tema-${nome}`,
        });
      }

      const tema = new TemaMuiSistema();
      tema.useTransaction(trx);
      try {
        tema.fill({
          nome,
          ativo: ativo ? 1 : 0,
          muiMode: muiMode as MUI.MuiMode,
          urlLogoHeader,
          urlFavicon,
          urlLogoLogin,
          urlLogoSimples,
          backgroundDefault,
          backgroundPaper,
          textPrimary,
          textSecondary,
          textDisabled,
        });

        await tema.save();

        // se ativar o tema, inativa os demais
        if (ativo) {
          await TemaMuiSistema.inativarOutrosTemas(tema);
        }

        // relaciona os ids das paletas de cores ao tema,
        // definido a coluna nome_prop_mui de acordo com o
        // nome da cor no MUI
        await tema.related("paletasCores").sync(
          Object.keys(idsPaletasCores).reduce((acc, nomeCorMui) => {
            const id = idsPaletasCores[nomeCorMui];
            acc[id] = {
              nome_prop_mui: nomeCorMui,
            };
            return acc;
          }, {})
        );
      } catch (e) {
        trx.rollback();
        // deleta imagens do disco caso a transação falhe
        await Promise.all([
          UploadImagem.delete(urlFavicon),
          UploadImagem.delete(urlLogoHeader),
          UploadImagem.delete(urlLogoLogin),
          UploadImagem.delete(urlLogoSimples),
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
