import { Migration } from '@mikro-orm/migrations';

export class Migration20210428131917 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "inspection_form_item" drop column "range_start"')
    this.addSql('alter table "inspection_form_item" drop column "range_end"')
    this.addSql('alter table "inspection_form_item" add column "remark_for_pass" bool not null, add column "remark_for_fail" bool not null;');

    this.addSql('alter table "employee" add column "name" varchar(255) not null, add column "phone" varchar(255) null, add column "address" varchar(255) null, add column "date_of_birth" varchar(255) null, add column "start_work" timestamptz(0) null, add column "end_work" timestamptz(0) null;');
    this.addSql('alter table "employee" drop column "start_work_from";');

    this.addSql('alter table "account" add column "avatar" varchar(255) null;');

    this.addSql('alter table "driver" add column "license_number" varchar(255) null, add column "license_class" varchar(255) null, add column "license_where" varchar(255) null;');
    this.addSql('alter table "driver" drop column "name";');
    this.addSql('alter table "driver" drop column "phone";');
    this.addSql('alter table "driver" drop column "address";');
    this.addSql('alter table "driver" drop column "date_of_birth";');

    this.addSql('alter table "manager" drop column "name";');
    this.addSql('alter table "manager" drop column "phone";');
    this.addSql('alter table "manager" drop column "address";');
    this.addSql('alter table "manager" drop column "date_of_birth";');
  }

}
