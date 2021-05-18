import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType, registerEnumType } from "type-graphql";
import { Base } from "./Base";
import { Driver } from "./Driver";
import { Vehicle } from "./Vehicle";

@Entity()
@ObjectType()
@InputType('MaintainHistoryInput')
export class MaintainHistory extends Base {
    @ManyToOne(() => Driver)
    @Field(() => Driver)
    driver: Driver;

    @ManyToOne(() => Vehicle)
    @Field(() => Vehicle)
    vehicle: Vehicle;

    @Enum(() => Type)
    @Field(() => Type)
    type: Type;

    @Property()
    @Field()
    time: Date;
}

enum Type {
    MAINTAINCE = "maintaince",
    REPAIR = "repair"
}

registerEnumType(Type, {
    name: "MaintainHistoryType", // this one is mandatory
    description: "Maintain history type", // this one is optional
});