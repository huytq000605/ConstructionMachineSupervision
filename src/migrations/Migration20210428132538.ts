import { Migration } from '@mikro-orm/migrations';

export class Migration20210428132538 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "inspection_form_item" add column "range_start" int4 null, add column "range_end" int4 null;');
  }

}
