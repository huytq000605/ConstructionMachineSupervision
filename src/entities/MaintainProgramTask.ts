import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { MaintainProgram } from "./MaintainProgram";
import { MaintainTask } from "./MaintainTask";

@Entity()
@ObjectType()
@InputType("MaintainProgramTaskInput")
export class MaintainProgramTask extends Base {
    @Field()
    @Property({nullable:true})
    timeThreshold: number;

    @Field()
    @Property({nullable:true})
    distanceThreshold: number;

    @Field()
    @Property()
    done: boolean;

    @ManyToOne(() => MaintainProgram, {nullable:true})
    @Field(() => MaintainProgram)
    maintainProgram: MaintainProgram;

    @ManyToOne(() => MaintainTask, {nullable:true})
    @Field(() => MaintainTask)
    maintainTask: MaintainTask;
}