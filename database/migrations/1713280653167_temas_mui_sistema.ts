import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "temas_mui_sistema";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("nome").nullable();

      table.boolean("ativo").defaultTo(true);
      table.enum("mui_mode", ["light", "dark"]).notNullable();

      table.string("url_favicon").notNullable();
      table.string("url_logo_header").notNullable();
      table.string("url_logo_login").notNullable();
      table.string("url_logo_simples").notNullable();

      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
