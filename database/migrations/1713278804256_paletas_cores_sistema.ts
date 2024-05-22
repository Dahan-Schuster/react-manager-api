import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "paletas_cores_sistema";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("nome").nullable();

      table.string("main").notNullable();
      table.string("dark").nullable();
      table.string("light").nullable();

      table.string("100").nullable();
      table.string("200").nullable();
      table.string("300").nullable();
      table.string("400").nullable();
      table.string("500").nullable();
      table.string("600").nullable();
      table.string("700").nullable();

      table.string("contrastText").nullable();

      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
