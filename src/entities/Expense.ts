import {
	Collection,
	Entity,
	ManyToMany,
	Property,
	Unique,
} from "@mikro-orm/core";
import { Field, ObjectType, InputType } from "type-graphql";
import { Base } from "./Base";
import { Vehicle } from "./Vehicle";

@ObjectType()
@Entity()
@InputType("ExpenseInput")
@Unique({ properties: ["name"] })
export class Expense extends Base {	
	@Field()
	@Property()
	name: string;

	@ManyToMany(() => Vehicle, (vehicle) => vehicle.expenses)
    @Field(() => [Vehicle])
    vehicles = new Collection<Vehicle>(this);
}
