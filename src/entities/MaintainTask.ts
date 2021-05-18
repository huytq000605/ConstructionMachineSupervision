import { Collection, Entity, Enum, ManyToOne, OneToMany, OneToOne, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType, registerEnumType } from "type-graphql";
import { Base } from "./Base";
import { MaintainProgramTask } from "./MaintainProgramTask";

@Entity()
@ObjectType()
@InputType("MaintainTaskInput")
export class MaintainTask extends Base {
    @Field()
    @Property()
    name: string

    @Field()
    @Property()
	description: string;

    @OneToMany(() => MaintainProgramTask, maintainProgramTask => maintainProgramTask.maintainTask, {nullable:true})
    @Field(() => [MaintainProgramTask])
    maintainProgramTask = new Collection<MaintainProgramTask>(this);
}