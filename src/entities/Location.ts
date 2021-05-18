import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { Device } from "./Device";
import { Vehicle } from "./Vehicle";

@Entity()
@ObjectType()
@InputType('LocationInput')
export class Location extends Base {
    @ManyToOne(() => Vehicle, {nullable:true})
    @Field(() => Vehicle)
    vehicle: Vehicle;

    @Property()
    @Field()
    lat: number;

    @Property()
    @Field()
    long: number;
    
    @Property()
    @Field()
    time: string;

    @ManyToOne(() => Device)
    @Field(() => Device)
    by: Device
}