import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "temas_mui_sistema";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("cor_header", 7).nullable();
      table.string("cor_texto_header", 7).nullable();
      table.string("cor_menu", 7).nullable();
      table.string("cor_texto_menu", 7).nullable();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("cor_header");
      table.dropColumn("cor_texto_header");
      table.dropColumn("cor_menu");
      table.dropColumn("cor_texto_menu");
    });
  }
}
