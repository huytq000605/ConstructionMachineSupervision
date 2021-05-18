import { Migration } from "@mikro-orm/migrations";

export class Migration20210326073058 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" add column "email" varchar(255) not null;');
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");'
    );

    this.addSql('alter table "user" drop constraint "user_username_unique";');
  }
}
