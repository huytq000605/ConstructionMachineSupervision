import { Migration } from '@mikro-orm/migrations';

export class Migration20210413145826 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "role" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null);');
    this.addSql('alter table "role" add constraint "role_name_unique" unique ("name");');

    this.addSql('alter table "project" add column "start" timestamptz(0) not null, add column "end" timestamptz(0) not null, add column "value" varchar(255) not null, add column "place" varchar(255) not null, add column "company_role" varchar(255) not null, add column "progress" int4 not null;');

    this.addSql('create table "permission" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null);');
    this.addSql('alter table "permission" add constraint "permission_name_unique" unique ("name");');

    this.addSql('alter table "vehicle" add column "name" varchar(255) not null, add column "status" varchar(255) not null, add column "information" varchar(255) not null, add column "description" varchar(255) not null, add column "maintain_time" int4 not null, add column "hours_worked" int4 not null, add column "guarantee_time" timestamptz(0) not null;');

    this.addSql('create table "account" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null);');
    this.addSql('alter table "account" add constraint "account_username_unique" unique ("username");');
    this.addSql('alter table "account" add constraint "account_email_unique" unique ("email");');

    this.addSql('create table "driver" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "phone" varchar(255) not null, "account_id" int4 not null);');
    this.addSql('alter table "driver" add constraint "driver_account_id_unique" unique ("account_id");');

    this.addSql('create table "maintain_history" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "driver_id" int4 not null, "vehicle_id" int4 not null, "type" int2 not null, "time" timestamptz(0) not null);');

    this.addSql('create table "refill_history" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "driver_id" int4 not null, "vehicle_id" int4 not null, "type" int2 not null, "time" timestamptz(0) not null, "price" varchar(255) not null, "current_price" varchar(255) not null);');

    this.addSql('create table "report" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "driver_id" int4 not null);');

    this.addSql('create table "manager" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "phone" varchar(255) not null, "account_id" int4 not null);');
    this.addSql('alter table "manager" add constraint "manager_account_id_unique" unique ("account_id");');

    this.addSql('create table "decision" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "manager_id" int4 not null);');

    this.addSql('create table "manager_project" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "manager_id" int4 not null, "project_id" int4 not null);');

    this.addSql('create table "mobilization_session" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "start" timestamptz(0) not null, "end" timestamptz(0) not null, "pending" bool not null, "driver_id" int4 not null, "manager_id" int4 not null, "vehicle_id" int4 not null, "decision_id" int4 not null);');

    this.addSql('create table "project_driver" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "driver_id" int4 not null, "project_id" int4 not null, "manager_id" int4 not null);');

    this.addSql('create table "project_vehicle" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "driver_id" int4 not null, "project_id" int4 not null, "manager_id" int4 not null);');

    this.addSql('create table "account_roles" ("account_id" int4 not null, "role_id" int4 not null);');
    this.addSql('alter table "account_roles" add constraint "account_roles_pkey" primary key ("account_id", "role_id");');

    this.addSql('create table "account_permissions" ("account_id" int4 not null, "permission_id" int4 not null);');
    this.addSql('alter table "account_permissions" add constraint "account_permissions_pkey" primary key ("account_id", "permission_id");');

    this.addSql('alter table "driver" add constraint "driver_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;');

    this.addSql('alter table "maintain_history" add constraint "maintain_history_driver_id_foreign" foreign key ("driver_id") references "driver" ("id") on update cascade;');
    this.addSql('alter table "maintain_history" add constraint "maintain_history_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade;');

    this.addSql('alter table "refill_history" add constraint "refill_history_driver_id_foreign" foreign key ("driver_id") references "driver" ("id") on update cascade;');
    this.addSql('alter table "refill_history" add constraint "refill_history_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade;');

    this.addSql('alter table "report" add constraint "report_driver_id_foreign" foreign key ("driver_id") references "driver" ("id") on update cascade;');

    this.addSql('alter table "manager" add constraint "manager_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;');

    this.addSql('alter table "decision" add constraint "decision_manager_id_foreign" foreign key ("manager_id") references "manager" ("id") on update cascade;');

    this.addSql('alter table "manager_project" add constraint "manager_project_manager_id_foreign" foreign key ("manager_id") references "manager" ("id") on update cascade;');
    this.addSql('alter table "manager_project" add constraint "manager_project_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');

    this.addSql('alter table "mobilization_session" add constraint "mobilization_session_driver_id_foreign" foreign key ("driver_id") references "driver" ("id") on update cascade;');
    this.addSql('alter table "mobilization_session" add constraint "mobilization_session_manager_id_foreign" foreign key ("manager_id") references "manager" ("id") on update cascade;');
    this.addSql('alter table "mobilization_session" add constraint "mobilization_session_vehicle_id_foreign" foreign key ("vehicle_id") references "vehicle" ("id") on update cascade;');
    this.addSql('alter table "mobilization_session" add constraint "mobilization_session_decision_id_foreign" foreign key ("decision_id") references "decision" ("id") on update cascade;');

    this.addSql('alter table "project_driver" add constraint "project_driver_driver_id_foreign" foreign key ("driver_id") references "driver" ("id") on update cascade;');
    this.addSql('alter table "project_driver" add constraint "project_driver_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');
    this.addSql('alter table "project_driver" add constraint "project_driver_manager_id_foreign" foreign key ("manager_id") references "manager" ("id") on update cascade;');

    this.addSql('alter table "project_vehicle" add constraint "project_vehicle_driver_id_foreign" foreign key ("driver_id") references "driver" ("id") on update cascade;');
    this.addSql('alter table "project_vehicle" add constraint "project_vehicle_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;');
    this.addSql('alter table "project_vehicle" add constraint "project_vehicle_manager_id_foreign" foreign key ("manager_id") references "manager" ("id") on update cascade;');

    this.addSql('alter table "account_roles" add constraint "account_roles_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "account_roles" add constraint "account_roles_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "account_permissions" add constraint "account_permissions_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "account_permissions" add constraint "account_permissions_permission_id_foreign" foreign key ("permission_id") references "permission" ("id") on update cascade on delete cascade;');
  }

}
