import { Migration } from '@mikro-orm/migrations';

export class Migration20210406085132 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project" drop constraint if exists "project_description_check";');
    this.addSql('alter table "project" alter column "description" type varchar(255) using ("description"::varchar(255));');
    this.addSql('alter table "project" alter column "description" drop not null;');
  }

}
