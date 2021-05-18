import { Migration } from '@mikro-orm/migrations';

export class Migration20210508063207 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "inspection_item" drop constraint if exists "inspection_item_type_check";');
    this.addSql('alter table "inspection_item" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "inspection_item" add constraint "inspection_item_type_check" check ("type" in (\'choices\', \'passOrFail\', \'dateTime\', \'rangeTime\'));');

    this.addSql('alter table "maintain_history" drop constraint if exists "maintain_history_type_check";');
    this.addSql('alter table "maintain_history" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "maintain_history" add constraint "maintain_history_type_check" check ("type" in (\'maintaince\', \'repair\'));');

    this.addSql('alter table "refill_history" drop constraint if exists "refill_history_type_check";');
    this.addSql('alter table "refill_history" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "refill_history" add constraint "refill_history_type_check" check ("type" in (\'gasoline\', \'oil\'));');
  }

}
