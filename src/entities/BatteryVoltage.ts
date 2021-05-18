import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { Device } from "./Device";
import { Vehicle } from "./Vehicle";

@Entity()
@ObjectType()
@InputType('BatteryVoltageInput')
export class BatteryVoltage extends Base {
    @ManyToOne(() => Vehicle)
    @Field(() => Vehicle)
    vehicle: Vehicle;

    @Property()
    @Field()
    voltage: number;
    
    @ManyToOne(() => Device)
    @Field(() => Device)
    by: Device
}