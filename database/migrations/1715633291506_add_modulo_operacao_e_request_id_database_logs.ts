import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "database_logs";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("evento");
      table.string("modulo").notNullable().after("id");
      table.string("operacao").notNullable().after("modulo");
      table.string("request_id").nullable().after("observacoes");
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string("evento").notNullable();
      table.dropColumn("modulo");
      table.dropColumn("operacao");
      table.dropColumn("request_id");
    });
  }
}
