import { Migration } from '@mikro-orm/migrations';

export class Migration20210326083017 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop column "username";');
  }

}
