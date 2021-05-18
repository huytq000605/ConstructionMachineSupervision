import { Entity, ManyToOne } from "@mikro-orm/core";
import { Base } from "./Base";
import { Project } from "./Project";
import { Driver } from "./Driver";
import { Manager } from "./Manager";
import { Field, InputType, ObjectType } from "type-graphql";

@Entity()
@ObjectType()
@InputType('ProjectDriverInput')
export class ProjectDriver extends Base {
    @ManyToOne(() => Driver)
    @Field(() => Driver)
    driver: Driver

    @ManyToOne(() => Project)
    @Field(() => Project)
    project: Project

    @ManyToOne(() => Manager)
    @Field(() => Manager)
    manager: Manager
}