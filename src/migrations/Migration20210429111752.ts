import { Migration } from '@mikro-orm/migrations';

export class Migration20210429111752 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "employee" drop constraint if exists "employee_address_check";');
    this.addSql('alter table "employee" alter column "address" type jsonb using ("address"::jsonb);');
  }

}
