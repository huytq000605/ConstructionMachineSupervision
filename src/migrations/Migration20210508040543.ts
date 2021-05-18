import { Migration } from "@mikro-orm/migrations";

export class Migration20210508040543 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "temperature" rename to device_temperature;');
  }
}
