import { Collection, Entity, ManyToMany, OneToMany, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { MaintainProgramTask } from "./MaintainProgramTask";
import { Vehicle } from "./Vehicle";

@Entity()
@ObjectType()
@InputType("MaintainProgramInput")
export class MaintainProgram extends Base {
    @Field()
    @Property()
    name: string

    @Field()
    @Property()
	description: string;

    @ManyToMany(() => Vehicle, (vehicle) => vehicle.maintainPrograms, {nullable:true})
    @Field(() => [Vehicle])
    vehicles = new Collection<Vehicle>(this);

    @OneToMany(() => MaintainProgramTask, maintainProgramTask => maintainProgramTask.maintainProgram, {nullable:true})
    @Field(() => [MaintainProgramTask])
    maintainProgramTask = new Collection<MaintainProgramTask>(this);
}