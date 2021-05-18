import {
	Collection,
	Entity,
	ManyToMany,
	ManyToOne,
	Property,
} from "@mikro-orm/core";
import { Field, ObjectType, InputType } from "type-graphql";
import { Account } from "./Account";
import { Base } from "./Base";
import { Employee } from "./Employee";
import { Label } from "./Label";
import { Vehicle } from "./Vehicle";

@ObjectType()
@Entity()
@InputType("IssueInput")
export class Issue extends Base {
	@Property()
	@Field()
	description: string;

	@Field()
	status: string;

	@Field()
	dueDate: Date;

	@Field(() => [Employee])
	@ManyToMany(() => Employee, (employee) => employee.issues, { owner: true, nullable: true })
	assignees = new Collection<Employee>(this);

	@Field(() => Vehicle)
	@ManyToOne(() => Vehicle)
	vehicle!: Vehicle;

	@ManyToMany(() => Label, (label) => label.issues, { owner: true, nullable: true })
	@Field(() => [Label], { nullable: true })
	labels = new Collection<Label>(this);
}
