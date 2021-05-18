import { Collection, Entity, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { Device } from "./Device";
import { InspectionForm } from "./InspectionForm";
import { InspectionItem } from "./InspectionItem";
import { Vehicle } from "./Vehicle";

@Entity()
@ObjectType()
@InputType("InspectionFormItemInput")
export class InspectionFormItem extends Base {
    @Field()
    @Property({ type: "boolean" })
    required: boolean;

    @Field()
    @Property()
    shortDescription: string;

    @Field()
    @Property()
    instruction: string;

    @Field()
    @Property({type: "boolean"})
    remarkForPass: boolean;

    @Field()
    @Property({type: "boolean"})
    remarkForFail: boolean

    @Field({ nullable: true })
    @Property({ type: "boolean", nullable: true })
    isPass: boolean;

    @Field({ nullable: true })
    @Property({ nullable: true, columnType: "jsonb" })
    choices: string;

    @Field({ nullable: true })
    @Property({ type: "date", nullable: true })
    date: Date;

    @Field({nullable: true})
    @Property({ type: "number", nullable: true})
    rangeStart: number

    @Field({nullable: true})
    @Property({ type: "number", nullable: true})
    rangeEnd: number

    @ManyToOne(() => InspectionForm)
    @Field(() => InspectionForm)
    inspectionForm: InspectionForm;

    @ManyToOne(() => InspectionItem)
    @Field(() => InspectionItem)
    inspectionItem: InspectionItem;
}