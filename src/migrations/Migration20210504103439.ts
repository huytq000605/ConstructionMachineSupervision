import { Migration } from '@mikro-orm/migrations';

export class Migration20210504103439 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "project" drop constraint if exists "project_place_check";');
    this.addSql('alter table "project" alter column "place" type jsonb using ("place"::jsonb);');

    this.addSql('alter table "account" drop constraint "account_username_unique";');
    this.addSql('alter table "account" drop column "username";');
  }

}
