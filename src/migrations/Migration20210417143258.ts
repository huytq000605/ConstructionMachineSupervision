import { Migration } from '@mikro-orm/migrations';

export class Migration20210417143258 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "driver" add column "address" varchar(255) not null, add column "date_of_birth" varchar(255) not null;');

    this.addSql('alter table "manager" add column "address" varchar(255) not null, add column "date_of_birth" varchar(255) not null;');
  }


}
