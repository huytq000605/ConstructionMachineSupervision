import { Migration } from '@mikro-orm/migrations';

export class Migration20210406031834 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "vehicle_model" add constraint "vehicle_model_manufacturer_id_name_unique" unique ("manufacturer_id", "name");');
  }

}
