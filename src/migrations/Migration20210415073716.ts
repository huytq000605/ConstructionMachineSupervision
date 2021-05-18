import { Migration } from '@mikro-orm/migrations';

export class Migration20210415073716 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "speed" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "vehicle_id" int4 not null, "speed" int4 not null);');

    this.addSql('create table "location" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "vehicle_id" int4 not null, "lat" int4 not null, "lon" int4 not null);');

    this.addSql('create table "device" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "vehicle_id" int4 not null);');
    this.addSql('alter table "device" add constraint "device_vehicle_id_unique" unique ("vehicle_id");');

    this.addSql('create table "environment" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "device_id" int4 not null, "humidity" int4 not null, "temperature" int4 not null);');

    this.addSql('create table "battery_voltage" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "device_id" int4 not null, "voltage" int4 not null);');

    this.addSql('create table "temperature" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "device_id" int4 not null, "temperature" int4 not null);');

    this.addSql('create table "baterry_voltage" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "vehicle_id" int4 not null, "voltage" int4 not null);');

    this.addSql('alter table "speed" add constraint "speed_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade;');

    this.addSql('alter table "location" add constraint "location_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade;');

    this.addSql('alter table "device" add constraint "device_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade;');

    this.addSql('alter table "environment" add constraint "environment_device_id_foreign" foreign key ("device_id") references "device" ("id") on update cascade;');

    this.addSql('alter table "battery_voltage" add constraint "battery_voltage_device_id_foreign" foreign key ("device_id") references "device" ("id") on update cascade;');

    this.addSql('alter table "temperature" add constraint "temperature_device_id_foreign" foreign key ("device_id") references "device" ("id") on update cascade;');

    this.addSql('alter table "baterry_voltage" add constraint "baterry_voltage_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade;');
  }

}
