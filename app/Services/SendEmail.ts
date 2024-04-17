import Mail from "@ioc:Adonis/Addons/Mail";
import { MessageComposeCallback } from "@ioc:Adonis/Addons/Mail";
import Env from "@ioc:Adonis/Core/Env";
import TemaMuiSistema from "App/Models/TemaMuiSistema";

export default class SendMail {
  public static async send(
    destinatario: string,
    subject: string,
    body: string,
    params: Record<string, any> = {},
    sendLater: boolean = true
  ) {
    try {
      let enviar = Env.get("ENVIAR_EMAIL");
      if (!enviar)
        return {
          status: true,
          mensagem: "Email não enviado por determinação do ambiente",
        };

      const temaAtivo = await TemaMuiSistema.getAtivo("light");
      const callback: MessageComposeCallback = (message) => {
        message
          .from(Env.get("SMTP_USERNAME"))
          .to(destinatario)
          .subject(subject)
          .htmlView(body, {
            ...params,
            nomeApp: Env.get("NOME_PROJETO"),
            nomeCliente: Env.get("NOME_CLIENTE"),
            tema: temaAtivo?.coresMui || {},
          });
      };
      if (sendLater) {
        await Mail.sendLater(callback);
      } else {
        await Mail.send(callback);
      }

      return { status: true, mensagem: "Email enviado com sucesso!" };
    } catch (error) {
      console.log(error);
      return { status: false, mensagem: error };
    }
  }
}
