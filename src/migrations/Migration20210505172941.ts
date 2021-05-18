import { Migration } from '@mikro-orm/migrations';

export class Migration20210505172941 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "location" drop constraint if exists "location_lat_check";');
    this.addSql('ALTER TABLE "location" ALTER COLUMN "lat" TYPE numeric(10,8);');
    this.addSql('alter table "location" drop constraint if exists "location_lon_check";');
    this.addSql('ALTER TABLE "location" ALTER COLUMN "lon" TYPE numeric(10,8);');
  }
  
  async down(): Promise<void> {

  }

}
