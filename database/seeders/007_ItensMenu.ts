import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import MenuItem from "App/Models/MenuItem";
import Permissao from "App/Models/Permissao";

const permissoesItens = {
  "/usuarios": ["usuarios-listar"],
  "/perfis": ["perfis-listar"],
  "/temas": ["temas-listar"],
  "/temas/novo": ["temas-criar"],
};

export default class extends BaseSeeder {
  public async run() {
    const itens = await MenuItem.fetchOrCreateMany(
      ["url", "target", "publico"],
      [
        {
          label: "Página inicial",
          url: "/",
          target: "_self",
          icone: "home",
          ativo: true,
          publico: true,
          ordem: 1,
          parent_id: null,
        },
        {
          label: "Usuários",
          url: "/usuarios",
          target: "_self",
          icone: "people",
          ativo: true,
          publico: false,
          ordem: 2,
          parent_id: null,
        },
        {
          label: "Perfis",
          url: "/perfis",
          target: "_self",
          icone: "account_box",
          ativo: true,
          publico: false,
          ordem: 3,
          parent_id: null,
        },
        {
          label: "Temas",
          url: "/temas",
          target: "_self",
          icone: "palette",
          ativo: true,
          publico: false,
          ordem: 4,
          parent_id: null,
        },
        {
          label: "Criar tema",
          url: "/temas/novo",
          target: "_self",
          icone: "add_circle",
          ativo: true,
          publico: false,
          ordem: 4.1,
          parent_id: null,
        },
      ]
    );

    console.log("itens de menu:", itens.map((i) => i.url).join(", "));

    await Promise.all(
      itens.map(async (item) => {
        const slugPermissoes = item.url ? permissoesItens[item.url] : [];
        if (!slugPermissoes) return;

        const permissoes = await Permissao.query().whereIn(
          "slug",
          slugPermissoes
        );
        if (permissoes.length === 0) return;

        const idsPermissoes = permissoes.map((p) => p.id);

        console.log(`permissões do item ${item.label}:`, idsPermissoes);
        await item.related("permissoes").sync(idsPermissoes, false);

        if (item.url === "/temas/novo") {
          item.parent_id = itens.find((i) => i.url === "/temas")?.id || null;
          if (item.parent_id) await item.save();
        }
      })
    );
  }
}
