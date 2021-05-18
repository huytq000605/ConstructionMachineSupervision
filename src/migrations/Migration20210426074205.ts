import { Migration } from '@mikro-orm/migrations';

export class Migration20210426074205 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "vehicle_status" drop constraint if exists "vehicle_status_description_check";');
    this.addSql('alter table "vehicle_status" alter column "description" type varchar(255) using ("description"::varchar(255));');
    this.addSql('alter table "vehicle_status" alter column "description" drop not null;');
    this.addSql('alter table "vehicle_status" drop constraint if exists "vehicle_status_background_check";');
    this.addSql('alter table "vehicle_status" alter column "background" type varchar(255) using ("background"::varchar(255));');
    this.addSql('alter table "vehicle_status" alter column "background" drop not null;');

    this.addSql('alter table "vehicle_status" add constraint "vehicle_status_name_unique" unique ("name");');
  }

}
