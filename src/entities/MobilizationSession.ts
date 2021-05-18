import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { Decision } from "./Decision";
import { Driver } from "./Driver";
import { Manager } from "./Manager";
import { Project } from "./Project";
import { Vehicle } from "./Vehicle";

@Entity()
@ObjectType()
@InputType('MobilizationSessionInput')
export class MobilizationSession extends Base {
    @Property()
    @Field()
    start: Date;

    @Property()
    @Field()
    startOdometer: number;

    @Property({ nullable: true })
    @Field({ nullable: true })
    end: Date;

    @Property({ nullable: true })
    @Field({ nullable: true })
    endOdometer: number;

    @Property()
    @Field()
    pending: boolean;

    @ManyToOne(() => Driver)
    @Field(() => Driver)
    driver: Driver;

    @ManyToOne(() => Manager)
    @Field(() => Manager)
    manager: Manager;

    @ManyToOne(() => Vehicle)
    @Field(() => Vehicle)
    vehicle: Vehicle;

    @ManyToOne(() => Decision)
    @Field(() => Decision)
    decision: Decision;

    @ManyToOne(() => Project, { nullable: true })
    @Field(() => Project, {nullable: true})
    project?: Project;

    @Property()
    @Field()
    description: string
}