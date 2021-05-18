import { Migration } from '@mikro-orm/migrations';

export class Migration20210507161518 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "vehicle" add column "speed" numeric(7,3) not null, add column "vin" varchar(255) not null, add column "license_plate" varchar(255) not null, add column "year" varchar(255) not null, add column "run_time" int4 not null;');

    this.addSql('create table "maintain_task" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) not null);');

    this.addSql('create table "maintain_program" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) not null);');

    this.addSql('create table "maintain_program_task" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "time_threshold" int4 not null, "distance_threshold" int4 not null, "done" bool not null, "maintain_program_id" int4 not null, "maintain_task_id" int4 not null);');

    this.addSql('create table "vehicle_maintain_programs" ("vehicle_id" int4 not null, "maintain_program_id" int4 not null);');
    this.addSql('alter table "vehicle_maintain_programs" add constraint "vehicle_maintain_programs_pkey" primary key ("vehicle_id", "maintain_program_id");');

    this.addSql('alter table "maintain_program_task" add constraint "maintain_program_task_maintain_program_id_foreign" foreign key ("maintain_program_id") references "maintain_program" ("id") on update cascade;');
    this.addSql('alter table "maintain_program_task" add constraint "maintain_program_task_maintain_task_id_foreign" foreign key ("maintain_task_id") references "maintain_task" ("id") on update cascade;');

    this.addSql('alter table "vehicle_maintain_programs" add constraint "vehicle_maintain_programs_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "vehicle_maintain_programs" add constraint "vehicle_maintain_programs_maintain_program_id_foreign" foreign key ("maintain_program_id") references "maintain_program" ("id") on update cascade on delete cascade;');
  }

}
