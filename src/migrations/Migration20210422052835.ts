import { Migration } from '@mikro-orm/migrations';

export class Migration20210422052835 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "issue" rename column "name" to "description";');


    this.addSql('create table "issue_assignees" ("issue_id" int4 not null, "employee_id" int4 not null);');
    this.addSql('alter table "issue_assignees" add constraint "issue_assignees_pkey" primary key ("issue_id", "employee_id");');

    this.addSql('alter table "issue_assignees" add constraint "issue_assignees_issue_id_foreign" foreign key ("issue_id") references "issue" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "issue_assignees" add constraint "issue_assignees_employee_id_foreign" foreign key ("employee_id") references "employee" ("id") on update cascade on delete cascade;');
  }

}
