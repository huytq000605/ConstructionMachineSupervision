import { Migration } from '@mikro-orm/migrations';

export class Migration20210415154749 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "driver" drop constraint if exists "driver_account_id_check";');
    this.addSql('alter table "driver" alter column "account_id" type int4 using ("account_id"::int4);');
    this.addSql('alter table "driver" alter column "account_id" drop not null;');
    // this.addSql('alter table "driver" add constraint "driver_account_id_unique" unique ("account_id");');

    this.addSql('alter table "manager" drop constraint if exists "manager_account_id_check";');
    this.addSql('alter table "manager" alter column "account_id" type int4 using ("account_id"::int4);');
    this.addSql('alter table "manager" alter column "account_id" drop not null;');
    // this.addSql('alter table "manager" add constraint "manager_account_id_unique" unique ("account_id");');
  }

}
