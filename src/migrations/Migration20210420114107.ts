import { Migration } from '@mikro-orm/migrations';

export class Migration20210420114107 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "device" add column "name" varchar(255) not null;');

    this.addSql('alter table "account" add column "verify" bool not null, add column "last_active" timestamptz(0) not null;');
  }

}
