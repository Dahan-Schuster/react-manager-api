import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import ApiError from "App/Exceptions/ApiError";
import MenuItem from "App/Models/MenuItem";

export default class LoginController {
  public async handle({ auth, response, request }: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string({ escape: true, trim: true }),
      password: schema.string(),
    });

    const { email, password } = await request.validate({
      schema: validationSchema,
    });

    try {
      const token = await auth.use("jwt").attempt(email, password);

      const user = auth.user!;
      if (user.status === 0) {
        throw new ApiError(
          "Este usuário encontra-se inativo e não tem permissão para fazer login.",
          403
        );
      }

      await user.load("permissoes", (query) => {
        query.preload("menuItens", (query) => {
          query.where("ativo", true).andWhere("publico", false);
        });
      });

      const itensPublicos = await MenuItem.query().where("publico", true).andWhere("ativo", true);

      // agrupa os itens de menu de cada permissão em um único array
      const itensMenuFlat = [...itensPublicos, ...user.permissoes.map((p) => p.menuItens).flat()];

      // formata a lista de menus, removendo os subitens que o usuário não tem permissão para acessar
      const itensMenu = itensMenuFlat
        // filtra os itens que são subitens, pois estes serão inclusos no array children de cada item caso haja permissão
        .filter((i) => !i.parent_id)
        .map(
          (i) =>
            ({
              ...i.serialize(),
              children: i.children?.filter((child) =>
                // a lista itensMenuFlat tem os itens de menu de cada permissão, incluindo os subitens
                // se um subitem não estiver incluso nessa lista, significa que o usuário não tem permissão para acessar
                itensMenuFlat.find((item) => item.id === child.id)
              ),
            } as {
              id: number;
              label: string;
              ordem: number;
              children: MenuItem[];
            })
        )
        // remove itens duplicados
        .filter((value, index, self) => index === self.findIndex((item) => item.id === value.id))
        // ordena pelo campo ordem
        .sort((a, b) => a.ordem - b.ordem);

      return response.send({
        success: true,
        token,
        user: {
          ...user.serialize(),
          permissoes: user.permissoes.map((p) => ({
            ...p.serialize(),
            menuItens: undefined,
          })),
          itensMenu,
        },
      });
    } catch (e) {
      if (e?.constructor?.name === "InvalidCredentialsException") {
        throw new ApiError("Email ou senha inválidos", 401);
      }

      throw e;
    }
  }
}
