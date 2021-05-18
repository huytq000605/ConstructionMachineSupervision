import { Migration } from '@mikro-orm/migrations';

export class Migration20210419170628 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "notification_method" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null);');

    this.addSql('create table "notification_group" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) null);');

    this.addSql('create table "notification" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) null, "group_id" int4 null);');

    this.addSql('create table "employee" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "account_notification_group" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "enable" bool not null, "account_id" int4 not null, "notification_group_id" int4 not null);');

    this.addSql('create table "account_notification_method" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "enable" bool not null, "account_id" int4 not null, "notification_method_id" int4 not null, "notification_id" int4 not null);');

    this.addSql('alter table "driver" add column "employee_id" int4 not null;');
    this.addSql('alter table "driver" add constraint "driver_employee_id_unique" unique ("employee_id");');

    this.addSql('alter table "manager" add column "employee_id" int4 not null;');
    this.addSql('alter table "manager" add constraint "manager_employee_id_unique" unique ("employee_id");');

    this.addSql('alter table "notification" add constraint "notification_group_id_foreign" foreign key ("group_id") references "notification_group" ("id") on update cascade on delete set null;');

    this.addSql('alter table "account_notification_group" add constraint "account_notification_group_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;');
    this.addSql('alter table "account_notification_group" add constraint "account_notification_group_notification_group_id_foreign" foreign key ("notification_group_id") references "notification_group" ("id") on update cascade;');

    this.addSql('alter table "account_notification_method" add constraint "account_notification_method_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade;');
    this.addSql('alter table "account_notification_method" add constraint "account_notification_method_notification_method_id_foreign" foreign key ("notification_method_id") references "notification_method" ("id") on update cascade;');
    this.addSql('alter table "account_notification_method" add constraint "account_notification_method_notification_id_foreign" foreign key ("notification_id") references "notification" ("id") on update cascade;');

    this.addSql('alter table "driver" add constraint "driver_employee_id_foreign" foreign key ("employee_id") references "employee" ("id") on update cascade;');

    this.addSql('alter table "manager" add constraint "manager_employee_id_foreign" foreign key ("employee_id") references "employee" ("id") on update cascade;');
  }

}
