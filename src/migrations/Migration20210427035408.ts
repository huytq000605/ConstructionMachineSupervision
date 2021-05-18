import { Migration } from '@mikro-orm/migrations';

export class Migration20210427035408 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "employee" drop constraint if exists "employee_unit_check";');
    this.addSql('alter table "employee" alter column "unit" type varchar(255) using ("unit"::varchar(255));');
    this.addSql('alter table "employee" alter column "unit" drop not null;');
  }

}
