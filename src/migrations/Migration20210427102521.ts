import { Migration } from "@mikro-orm/migrations";

export class Migration20210427102521 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table \"device\" add column \"udi\" varchar(255) not null, add column \"state\" text check (\"state\" in ('init', 'ready', 'disconnected', 'sleeping', 'lost', 'alert')) not null;"
    );
    this.addSql(
      'alter table "device" drop constraint if exists "device_name_check";'
    );
    this.addSql(
      'alter table "device" alter column "name" type varchar(255) using ("name"::varchar(255));'
    );
    this.addSql('alter table "device" alter column "name" drop not null;');
    this.addSql(
      'alter table "device" add constraint "device_udi_unique" unique ("udi");'
    );
  }
}
