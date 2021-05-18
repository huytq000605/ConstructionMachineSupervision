import { Migration } from '@mikro-orm/migrations';

export class Migration20210421155256 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "vehicle_type" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null);');

    this.addSql('create table "vehicle_status" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) not null, "background" varchar(255) not null);');

    this.addSql('create table "vehicle_fuel" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null);');

    this.addSql('alter table "vehicle" add column "status_id" int4 not null, add column "fuel_id" int4 not null, add column "type_id" int4 not null;');
    this.addSql('alter table "vehicle" drop column "status";');

    this.addSql('create table "label" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null);');

    this.addSql('create table "issue" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "vehicle_id" int4 not null);');

    this.addSql('create table "issue_labels" ("issue_id" int4 not null, "label_id" int4 not null);');
    this.addSql('alter table "issue_labels" add constraint "issue_labels_pkey" primary key ("issue_id", "label_id");');

    this.addSql('create table "expense" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null);');

    this.addSql('create table "vehicle_expenses" ("vehicle_id" int4 not null, "expense_id" int4 not null);');
    this.addSql('alter table "vehicle_expenses" add constraint "vehicle_expenses_pkey" primary key ("vehicle_id", "expense_id");');

    this.addSql('alter table "device" add column "description" varchar(255) null;');

    this.addSql('alter table "vehicle" add constraint "vehicle_status_id_foreign" foreign key ("status_id") references "vehicle_status" ("id") on update cascade;');
    this.addSql('alter table "vehicle" add constraint "vehicle_fuel_id_foreign" foreign key ("fuel_id") references "vehicle_fuel" ("id") on update cascade;');
    this.addSql('alter table "vehicle" add constraint "vehicle_type_id_foreign" foreign key ("type_id") references "vehicle_type" ("id") on update cascade;');

    this.addSql('alter table "issue" add constraint "issue_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade;');

    this.addSql('alter table "issue_labels" add constraint "issue_labels_issue_id_foreign" foreign key ("issue_id") references "issue" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "issue_labels" add constraint "issue_labels_label_id_foreign" foreign key ("label_id") references "label" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "vehicle_expenses" add constraint "vehicle_expenses_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "vehicle_expenses" add constraint "vehicle_expenses_expense_id_foreign" foreign key ("expense_id") references "expense" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "vehicle_type" add constraint "vehicle_type_name_unique" unique ("name");');

    this.addSql('alter table "vehicle_fuel" add constraint "vehicle_fuel_name_unique" unique ("name");');

    this.addSql('alter table "expense" add constraint "expense_name_unique" unique ("name");');
  }

}
