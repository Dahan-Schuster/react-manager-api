import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "temas_mui_paletas_sistema";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table
        .integer("tema_mui_id")
        .unsigned()
        .references("temas_mui_sistema.id");

      table
        .integer("paleta_cores_id")
        .unsigned()
        .references("paletas_cores_sistema.id");

      table
        .enum("nome_prop_mui", [
          "primary",
          "secondary",
          "success",
          "info",
          "warning",
          "error",
        ])
        .notNullable();

      table.unique(["tema_mui_id", "nome_prop_mui"]);

      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
