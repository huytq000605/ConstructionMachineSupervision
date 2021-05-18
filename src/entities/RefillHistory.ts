import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { Driver } from "./Driver";
import { Vehicle } from "./Vehicle";
import { registerEnumType } from "type-graphql";
@Entity()
@ObjectType()
@InputType('RefillHistoryInput')
export class RefillHistory extends Base {
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

    @Property()
    @Field()
    price: string;

    @Property()
    @Field()
    currentPrice: string;

}

enum Type {
    GASOLINE = "gasoline",
    OIL = "oil",
}

registerEnumType(Type, {
    name: "RefillHistoryType", // this one is mandatory
    description: "Refill history type", // this one is optional
  });
  