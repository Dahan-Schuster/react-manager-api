import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "database_logs";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");

      table.string("evento").notNullable();
      table.string("origem").notNullable();
      table.json("dados").nullable();
      table.string("observacoes").nullable();

      table
        .integer("user_id")
        .unsigned()
        .references("users.id")
        .nullable()
        .onDelete("SET NULL");

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
