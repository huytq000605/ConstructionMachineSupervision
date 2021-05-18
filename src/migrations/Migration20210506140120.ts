import { Migration } from '@mikro-orm/migrations';

export class Migration20210506140120 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "temperature" drop constraint if exists "temperature_device_id_check";');
    this.addSql('alter table "temperature" alter column "device_id" type int4 using ("device_id"::int4);');
    this.addSql('alter table "temperature" alter column "device_id" drop not null;');
  }

}
