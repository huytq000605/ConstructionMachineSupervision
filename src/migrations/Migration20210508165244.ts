import { Migration } from '@mikro-orm/migrations';

export class Migration20210508165244 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "maintain_program_task" drop constraint if exists "maintain_program_task_maintain_program_id_check";');
    this.addSql('alter table "maintain_program_task" alter column "maintain_program_id" type int4 using ("maintain_program_id"::int4);');
    this.addSql('alter table "maintain_program_task" alter column "maintain_program_id" drop not null;');
    this.addSql('alter table "maintain_program_task" drop constraint if exists "maintain_program_task_maintain_task_id_check";');
    this.addSql('alter table "maintain_program_task" alter column "maintain_task_id" type int4 using ("maintain_task_id"::int4);');
    this.addSql('alter table "maintain_program_task" alter column "maintain_task_id" drop not null;');

    this.addSql('alter table "account" drop constraint if exists "account_avatar_check";');
    this.addSql('alter table "account" alter column "avatar" type varchar(255) using ("avatar"::varchar(255));');
  }

}
