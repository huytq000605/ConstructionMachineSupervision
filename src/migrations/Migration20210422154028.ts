import { Migration } from '@mikro-orm/migrations';

export class Migration20210422154028 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "inspection_form_item" add column "date" timestamptz(0) null, add column "range_start" timestamptz(0) null, add column "range_end" timestamptz(0) null;');
    this.addSql('alter table "inspection_form_item" drop constraint if exists "inspection_form_item_status_check";');
    this.addSql('alter table "inspection_form_item" alter column "status" type bool using ("status"::bool);');
    this.addSql('alter table "inspection_form_item" alter column "status" drop not null;');

    this.addSql('alter table "account" add column "root" bool null;');
  }

}
