import { Migration } from '@mikro-orm/migrations';

export class Migration20210406065748 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "project" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) not null);');
    this.addSql('alter table "project" add constraint "project_name_unique" unique ("name");');
  }

}
