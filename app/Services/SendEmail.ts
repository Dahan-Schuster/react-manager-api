import Mail from "@ioc:Adonis/Addons/Mail";
import Env from "@ioc:Adonis/Core/Env";

export default class SendMail {
  public static async send(
    destinatario: string,
    subject: string,
    body: string,
    params: Record<string, any> = {}
  ) {
    try {
      let enviar = Env.get("ENVIAR_EMAIL");
      if (!enviar)
        return {
          status: true,
          mensagem: "Email não enviado por determinação do ambiente",
        };

      await Mail.sendLater((message) => {
        message
          .from(Env.get("SMTP_USERNAME"))
          .to(destinatario)
          .subject(subject)
          .htmlView(body, {
            ...params,
            nomeApp: Env.get("NOME_PROJETO"),
            nomeCliente: Env.get("NOME_CLIENTE"),
          });
      });
      return { status: true, mensagem: "Email enviado com sucesso!" };
    } catch (error) {
      console.log(error);
      return { status: false, mensagem: error };
    }
  }
}
