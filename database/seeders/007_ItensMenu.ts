import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import MenuItem from "App/Models/MenuItem";
import Permissao from "App/Models/Permissao";

const PermissoesItens = {
  Configurações: ["usuarios-listar", "perfis-listar", "temas-listar"],
  Usuários: ["usuarios-listar"],
  "Criar usuário": ["usuarios-criar"],
  Perfis: ["perfis-listar"],
  Temas: ["temas-listar"],
  "Criar tema": ["temas-criar"],
  Logs: ["logs-listar"],
};

const RelacoesItens = {
  Usuários: "Configurações",
  "Criar usuário": "Usuários",
  Perfis: "Configurações",
  Temas: "Configurações",
  "Criar tema": "Temas",
  Logs: "Configurações",
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
          label: "Configurações",
          url: "",
          target: "_self",
          icone: "settings",
          ativo: true,
          publico: false,
          ordem: 101,
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
          label: "Criar usuário",
          url: "/usuarios/novo",
          target: "_self",
          icone: "person_add",
          ativo: true,
          publico: false,
          ordem: 2.1,
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
        {
          label: "Logs",
          url: "/logs",
          target: "_self",
          icone: "list",
          ativo: true,
          publico: false,
          ordem: 5,
          parent_id: null,
        },
      ]
    );

    console.log("itens de menu:", itens.map((i) => i.url).join(", "));

    // Configuração de permissões e itens pai (parent_id) de cada item
    await Promise.all(
      itens.map(async (item) => {
        // para cada item, verifica se deve linkar um item pai
        const labelItemPai = RelacoesItens[item.label];
        if (labelItemPai) {
          item.parent_id = itens.find((i) => i.label === labelItemPai)?.id || null;
          if (item.parent_id) await item.save();
        }

        // depois de salvar o parent_id, verifica se há permissões a serem adicionadas ao item
        const slugsPermissoes = PermissoesItens[item.label] || [];
        if (!slugsPermissoes) return;

        // busca as permissões pelo slug
        const permissoes = await Permissao.query().whereIn("slug", slugsPermissoes);
        if (permissoes.length === 0) return;

        const idsPermissoes = permissoes.map((p) => p.id);

        console.log(`permissões do item ${item.label}:`, idsPermissoes);
        // sincroniza as permissões sem apagar as já existentes
        await item.related("permissoes").sync(idsPermissoes, false);
      })
    );
  }
}
