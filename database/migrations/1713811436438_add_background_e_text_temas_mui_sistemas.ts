import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "temas_mui_sistema";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("background_default", 7).nullable();
      table.string("background_paper", 7).nullable();
      table.string("text_primary", 7).nullable();
      table.string("text_secondary", 7).nullable();
      table.string("text_disabled", 7).nullable();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("background_default");
      table.dropColumn("background_paper");
      table.dropColumn("text_primary");
      table.dropColumn("text_secondary");
      table.dropColumn("text_disabled");
    });
  }
}
