import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  public async up() {
    this.schema.dropTable("temas_mui_paletas_sistema");
    this.schema.dropTable("paletas_cores_sistema");
  }

  public async down() {}
}
