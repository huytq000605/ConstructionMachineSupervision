import { Migration } from '@mikro-orm/migrations';

export class Migration20210415093416 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "mobilization_session" add column "start_odometer" int4 not null, add column "end_odometer" int4 null;');
    this.addSql('alter table "mobilization_session" drop constraint if exists "mobilization_session_end_check";');
    this.addSql('alter table "mobilization_session" alter column "end" type timestamptz(0) using ("end"::timestamptz(0));');
    this.addSql('alter table "mobilization_session" alter column "end" drop not null;');
  }

}
