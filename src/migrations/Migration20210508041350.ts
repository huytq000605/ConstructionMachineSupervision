import { Migration } from '@mikro-orm/migrations';

export class Migration20210508041350 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "device" add column "settings" jsonb null;');
  }

}
