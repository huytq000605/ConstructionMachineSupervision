import { Migration } from '@mikro-orm/migrations';

export class Migration20210415142719 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "vehicle" add column "odometer" int4 not null;');

    this.addSql('create table "battery_voltage" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "vehicle_id" int4 not null, "voltage" int4 not null, "by_id" int4 not null);');

    this.addSql('alter table "battery_voltage" add constraint "battery_voltage_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade;');
    this.addSql('alter table "battery_voltage" add constraint "battery_voltage_by_id_foreign" foreign key ("by_id") references "device" ("id") on update cascade;');

    this.addSql('drop table if exists "baterry_voltage" cascade;');
  }

}
