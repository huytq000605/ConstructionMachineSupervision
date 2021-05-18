import { Migration } from '@mikro-orm/migrations';

export class Migration20210508094152 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "device" drop constraint if exists "device_state_check";');
    this.addSql('alter table "device" alter column "state" type text using ("state"::text);');
    this.addSql('alter table "device" add constraint "device_state_check" check ("state" in (\'init\', \'ready\', \'disconnected\', \'sleeping\', \'lost\', \'alert\'));');
    this.addSql('alter table "device" alter column "state" drop not null;');
  }

}
