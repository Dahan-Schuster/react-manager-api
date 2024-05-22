import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer("deleted_by")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("SET NULL");

      table.timestamp("deleted_at", { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign("deleted_by");
      table.dropColumn("deleted_by");
      table.dropColumn("deleted_at");
    });
  }
}
