import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
  Unique,
} from "@mikro-orm/core";
import { Field, ObjectType, InputType } from "type-graphql";
import { Base } from "./Base";
import { Manufacturer } from "./Manufacturer";
import { Vehicle } from "./Vehicle";

@ObjectType()
@Entity()
@InputType("VehicleModelInput")
@Unique({ properties: ["manufacturer", "name"] })
export class VehicleModel extends Base {
    @Field(() => Manufacturer)
    @ManyToOne(() => Manufacturer)
    manufacturer!: Manufacturer;

    @Field()
    @Property()
    name!: string;

    @OneToMany(() => Vehicle, (vehicle) => vehicle.model, {
        cascade: [Cascade.ALL],
    })
    @Field(() => [Vehicle])
    vehicles = new Collection<Vehicle>(this);
}
