import { Cascade, Collection, Entity, OneToMany, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { Place } from "./Employee";
import { MobilizationSession } from "./MobilizationSession";
@Entity()
@ObjectType()
@InputType('ProjectInput')
export class Project extends Base {
    @Field()
    @Property({ unique: true })
    name: string;

    @Field({ nullable: true })
    @Property({ nullable: true })
    description: string;

    @Property()
    @Field()
    start: Date;

    @Property({ nullable: true })
    @Field()
    end: Date;

    @Property({ nullable: true })
    @Field()
    value: string;

    @Property({ columnType: "jsonb", nullable: true })
    @Field({ nullable: true })
    place?: string;

    @Property({ nullable: true })
    @Field()
    companyRole: string;

    @Property()
    @Field()
    progress: number;

    @OneToMany(() => MobilizationSession, mobilizationSession => mobilizationSession.project, { cascade: [Cascade.ALL] })
    @Field(() => [MobilizationSession])
    mobilizationSessions = new Collection<MobilizationSession>(this);


}
