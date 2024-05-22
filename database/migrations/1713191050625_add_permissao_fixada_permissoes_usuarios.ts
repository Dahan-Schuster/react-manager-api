import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "permissoes_usuarios";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean("permissao_fixada").defaultTo(false);
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("permissao_fixada");
    });
  }
}
