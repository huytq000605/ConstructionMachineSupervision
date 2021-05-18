import { Migration } from '@mikro-orm/migrations';

export class Migration20210506153137 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "account" drop constraint if exists "account_avatar_check";');
    this.addSql('alter table "account" alter column "avatar" type varchar(255) using ("avatar"::text);');
  }

}
