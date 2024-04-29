import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "permissoes_menu_itens";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.integer("permissao_id").unsigned().references("permissoes.id");
      table.integer("menu_item_id").unsigned().references("menu_itens.id");
      table.unique(["permissao_id", "menu_item_id"]);
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
