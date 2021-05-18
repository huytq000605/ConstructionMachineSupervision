import { Migration } from '@mikro-orm/migrations';

export class Migration20210406021600 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "manufacturer" add constraint "manufacturer_name_unique" unique ("name");');
  }

}
