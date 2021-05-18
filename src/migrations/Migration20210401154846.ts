import { Migration } from '@mikro-orm/migrations';

export class Migration20210401154846 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "manufacturer" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null);');

    this.addSql('create table "vehicle_model" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "manufacturer_id" int4 not null, "name" varchar(255) not null);');

    this.addSql('create table "vehicle" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "manufacturer_id" int4 not null, "model_id" int4 not null, "weight" int4 not null);');

    this.addSql('alter table "vehicle_model" add constraint "vehicle_model_manufacturer_id_foreign" foreign key ("manufacturer_id") references "manufacturer" ("id") on update cascade;');

    this.addSql('alter table "vehicle" add constraint "vehicle_manufacturer_id_foreign" foreign key ("manufacturer_id") references "manufacturer" ("id") on update cascade;');
    this.addSql('alter table "vehicle" add constraint "vehicle_model_id_foreign" foreign key ("model_id") references "vehicle_model" ("id") on update cascade;');
  }

}
