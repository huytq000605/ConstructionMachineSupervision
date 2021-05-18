import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { Device } from "./Device";
import { Vehicle } from "./Vehicle";

@Entity()
@ObjectType()
@InputType('SpeedInput')
export class Speed extends Base {
    @ManyToOne(() => Vehicle)
    @Field(() => Vehicle)
    vehicle: Vehicle;

    @Property()
    @Field()
    speed: number;

    @ManyToOne(() => Device)
    @Field(() => Device)
    by: Device
    
}