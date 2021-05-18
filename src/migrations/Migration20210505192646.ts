import { Migration } from '@mikro-orm/migrations';

export class Migration20210505192646 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "location" rename column "lon" to "long";');


    this.addSql('alter table "location" add column "time" varchar(255) not null;');
    this.addSql('alter table "location" drop constraint if exists "location_vehicle_id_check";');
    this.addSql('alter table "location" alter column "vehicle_id" type int4 using ("vehicle_id"::int4);');
    this.addSql('alter table "location" alter column "vehicle_id" drop not null;');
  }

}
