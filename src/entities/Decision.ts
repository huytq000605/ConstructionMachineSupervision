import { Cascade, Collection, Entity, ManyToOne, OneToMany } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { Driver } from "./Driver";
import { Manager } from "./Manager";
import { MobilizationSession } from "./MobilizationSession";
import { Project } from "./Project";

@ObjectType()
@Entity()
@InputType('DecisionInput')
export class Decision extends Base {
    @ManyToOne(() => Manager)
    @Field(() => Manager)
    manager: Manager

    @OneToMany(() => MobilizationSession, mobilizationSession => mobilizationSession.decision, { cascade: [Cascade.ALL] })
    @Field(() => [MobilizationSession])
    mobilizationSessions = new Collection<MobilizationSession>(this);

}