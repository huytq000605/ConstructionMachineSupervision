import { Migration } from '@mikro-orm/migrations';

export class Migration20210508170526 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "maintain_program_task" drop constraint if exists "maintain_program_task_time_threshold_check";');
    this.addSql('alter table "maintain_program_task" alter column "time_threshold" type int4 using ("time_threshold"::int4);');
    this.addSql('alter table "maintain_program_task" alter column "time_threshold" drop not null;');
    this.addSql('alter table "maintain_program_task" drop constraint if exists "maintain_program_task_distance_threshold_check";');
    this.addSql('alter table "maintain_program_task" alter column "distance_threshold" type int4 using ("distance_threshold"::int4);');
    this.addSql('alter table "maintain_program_task" alter column "distance_threshold" drop not null;');
  }

}
