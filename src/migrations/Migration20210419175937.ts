import { Migration } from '@mikro-orm/migrations';

export class Migration20210419175937 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "employee" add column "salary" int4 not null, add column "unit" varchar(255) not null, add column "start_work_from" timestamptz(0) not null;');
  }

}
