import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "permissoes";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("slug").notNullable();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("slug");
    });
  }
}
