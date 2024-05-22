import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "temas_mui_sistema";

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json("cores_paleta").nullable();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn("cores_paleta");
    });
  }
}
