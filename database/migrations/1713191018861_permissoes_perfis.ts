import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "permissoes_perfis";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");

      table
        .integer("permissao_id")
        .unsigned()
        .references("permissoes.id")
        .onDelete("CASCADE");

      table
        .integer("perfil_id")
        .unsigned()
        .references("perfis.id")
        .onDelete("CASCADE");

      table.unique(["permissao_id", "perfil_id"]);

      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
