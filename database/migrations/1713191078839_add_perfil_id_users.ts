import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer("perfil_id")
        .unsigned()
        .references("perfis.id")
        .onDelete("SET NULL");
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign("perfil_id");
      table.dropColumn("perfil_id");
    });
  }
}
