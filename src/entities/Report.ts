import { Entity, ManyToOne } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { Driver } from "./Driver";

@Entity()
@ObjectType()
@InputType('ReportInput')
export class Report extends Base {
    @ManyToOne(() => Driver)
    @Field(() => Driver)
    driver: Driver
}