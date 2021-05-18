import { Migration } from "@mikro-orm/migrations";

export class Migration20210427103456 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "device" drop constraint if exists "device_vehicle_id_check";'
    );
    this.addSql(
      'alter table "device" alter column "vehicle_id" type int4 using ("vehicle_id"::int4);'
    );
    this.addSql(
      'alter table "device" alter column "vehicle_id" drop not null;'
    );
  }
}
