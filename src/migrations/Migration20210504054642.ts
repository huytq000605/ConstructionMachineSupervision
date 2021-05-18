import { Migration } from '@mikro-orm/migrations';

export class Migration20210504054642 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "role_permissions" ("role_id" int4 not null, "permission_id" int4 not null);');
    this.addSql('alter table "role_permissions" add constraint "role_permissions_pkey" primary key ("role_id", "permission_id");');

    this.addSql('alter table "role_permissions" add constraint "role_permissions_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "role_permissions" add constraint "role_permissions_permission_id_foreign" foreign key ("permission_id") references "permission" ("id") on update cascade on delete cascade;');

    this.addSql('drop table if exists "account_permissions" cascade;');
  }

}
