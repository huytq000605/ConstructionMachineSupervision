import {
	Collection,
	Entity,
	ManyToMany,
	Property,
} from "@mikro-orm/core";
import { Base } from "./Base";
import { Field, InputType, ObjectType } from "type-graphql";
import { Issue } from "./Issue";

@ObjectType()
@InputType("LabelInput")
@Entity()
export class Label extends Base {
	@Field()
	@Property()
	name: string;

	@ManyToMany(() => Issue, (issue) => issue.labels)
	@Field(() => [Label])
	issues = new Collection<Issue>(this);
}
