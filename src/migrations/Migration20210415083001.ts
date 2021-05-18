import { Migration } from '@mikro-orm/migrations';

export class Migration20210415083001 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "environment" add column "by_id" int4 not null;');

    this.addSql('alter table "location" add column "by_id" int4 not null;');

    this.addSql('alter table "speed" add column "by_id" int4 not null;');

    this.addSql('alter table "temperature" add column "by_id" int4 not null;');

    this.addSql('alter table "baterry_voltage" add column "by_id" int4 not null;');

    this.addSql('alter table "environment" add constraint "environment_by_id_foreign" foreign key ("by_id") references "device" ("id") on update cascade;');

    this.addSql('alter table "location" add constraint "location_by_id_foreign" foreign key ("by_id") references "device" ("id") on update cascade;');

    this.addSql('alter table "speed" add constraint "speed_by_id_foreign" foreign key ("by_id") references "device" ("id") on update cascade;');

    this.addSql('alter table "temperature" add constraint "temperature_by_id_foreign" foreign key ("by_id") references "device" ("id") on update cascade;');

    this.addSql('alter table "baterry_voltage" add constraint "baterry_voltage_by_id_foreign" foreign key ("by_id") references "device" ("id") on update cascade;');

    this.addSql('drop table if exists "battery_voltage" cascade;');
  }

}
