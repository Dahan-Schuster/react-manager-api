import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "menu_itens";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("label", 50).notNullable();
      table.string("url").nullable();
      table.enum("target", ["_self", "_blank", "_top", "_parent"]);
      table.string("icone").nullable();
      table.boolean("ativo").defaultTo(1);
      table.integer("parent_id").unsigned().references("menu_itens.id");

      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
