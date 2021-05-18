import { Migration } from '@mikro-orm/migrations';

export class Migration20210506163543 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "temperature" drop constraint if exists "temperature_temperature_check";');
    this.addSql('alter table "temperature" alter column "temperature" TYPE numeric(10,5);');
  }

}
