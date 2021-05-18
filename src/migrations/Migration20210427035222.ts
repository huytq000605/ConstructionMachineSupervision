import { Migration } from '@mikro-orm/migrations';

export class Migration20210427035222 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "inspection_form_item" rename column "status" to "is_pass";');


    this.addSql('alter table "employee" drop constraint if exists "employee_salary_check";');
    this.addSql('alter table "employee" alter column "salary" type int4 using ("salary"::int4);');
    this.addSql('alter table "employee" alter column "salary" drop not null;');

    this.addSql('alter table "inspection_form" add constraint "inspection_form_name_unique" unique ("name");');
  }

}
