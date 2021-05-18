import { Cascade, Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { Field, ObjectType, InputType } from "type-graphql";
import { Base } from "./Base";
import { Vehicle } from "./Vehicle";

@ObjectType()
@Entity()
@InputType("ManufacturerInput")
export class Manufacturer extends Base {
    @Field()
    @Property({ unique: true })
    name: string;

    @OneToMany(() => Vehicle, (vehicle) => vehicle.manufacturer, {
        cascade: [Cascade.ALL],
    })
    @Field(() => [Vehicle])
    vehicles = new Collection<Vehicle>(this);
}
