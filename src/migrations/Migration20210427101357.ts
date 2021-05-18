import { Migration } from '@mikro-orm/migrations';

export class Migration20210427101357 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project" drop constraint if exists "project_end_check";');
    this.addSql('alter table "project" alter column "end" type timestamptz(0) using ("end"::timestamptz(0));');
    this.addSql('alter table "project" alter column "end" drop not null;');
    this.addSql('alter table "project" drop constraint if exists "project_value_check";');
    this.addSql('alter table "project" alter column "value" type varchar(255) using ("value"::varchar(255));');
    this.addSql('alter table "project" alter column "value" drop not null;');
    this.addSql('alter table "project" drop constraint if exists "project_place_check";');
    this.addSql('alter table "project" alter column "place" type varchar(255) using ("place"::varchar(255));');
    this.addSql('alter table "project" alter column "place" drop not null;');
    this.addSql('alter table "project" drop constraint if exists "project_company_role_check";');
    this.addSql('alter table "project" alter column "company_role" type varchar(255) using ("company_role"::varchar(255));');
    this.addSql('alter table "project" alter column "company_role" drop not null;');
  }

}
