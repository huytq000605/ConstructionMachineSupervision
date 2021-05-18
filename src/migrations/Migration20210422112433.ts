import { Migration } from '@mikro-orm/migrations';

export class Migration20210422112433 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "inspection_item" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "type" int2 not null);');

    this.addSql('create table "inspection_form" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "created_by" int4 not null);');

    this.addSql('create table "inspection_form_item" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "required" bool not null, "short_description" varchar(255) not null, "instruction" varchar(255) not null, "status" bool not null, "choices" jsonb null, "inspection_form_id" int4 not null, "inspection_item_id" int4 not null);');

    this.addSql('alter table "inspection_form_item" add constraint "inspection_form_item_inspection_form_id_foreign" foreign key ("inspection_form_id") references "inspection_form" ("id") on update cascade;');
    this.addSql('alter table "inspection_form_item" add constraint "inspection_form_item_inspection_item_id_foreign" foreign key ("inspection_item_id") references "inspection_item" ("id") on update cascade;');
  }

}
