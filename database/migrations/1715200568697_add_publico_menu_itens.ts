import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "menu_itens";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean("publico").defaultTo(false);
      table.float("ordem").unsigned().notNullable();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("publico");
      table.dropColumn("ordem");
    });
  }
}
