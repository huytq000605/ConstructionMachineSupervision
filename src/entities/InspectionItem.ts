import { Collection, Entity, Enum, ManyToOne, OneToMany, OneToOne, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType, registerEnumType } from "type-graphql";
import { Base } from "./Base";
import { InspectionFormItem } from "./InspectionFormItem";

@Entity()
@ObjectType()
@InputType("InspectionItemInput")
export class InspectionItem extends Base {
    @Field()
    @Property()
    name: string

    @Enum(() => Type)
    @Field(() => Type)
    type: Type

    @OneToMany(() => InspectionFormItem, inspectionFormItem => inspectionFormItem.inspectionItem)
    @Field(() => [InspectionFormItem])
    inspectionFormItem = new Collection<InspectionFormItem>(this);
}

enum Type {
    CHOICES = "choices",
    PASSORFAIL = "passOrFail",
    DATETIME = "dateTime",
    RANGETIME = "rangeTime"
}

registerEnumType(Type, {
    name: "InspectionItemType", // this one is mandatory
    description: "Inspection item type type", // this one is optional
});