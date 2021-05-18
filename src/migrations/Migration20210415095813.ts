import { Migration } from '@mikro-orm/migrations';

export class Migration20210415095813 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "mobilization_session" add column "project_id" int4 null, add column "description" varchar(255) not null;');

    this.addSql('alter table "mobilization_session" add constraint "mobilization_session_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade on delete set null;');
  }

}
