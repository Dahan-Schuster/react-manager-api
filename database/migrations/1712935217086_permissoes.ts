import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "permissoes";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("label").notNullable().unique();

      table
        .integer("tipo_id")
        .unsigned()
        .references("tipos_permissoes.id")
        .onDelete("CASCADE");

      table
        .integer("modulo_id")
        .unsigned()
        .references("modulos.id")
        .onDelete("CASCADE");

      table.unique(["tipo_id", "modulo_id"]);

      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
