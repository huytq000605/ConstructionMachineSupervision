import {
	Collection,
	Entity,
	OneToMany,
	Property,
	Unique,
} from "@mikro-orm/core";
import { Field, ObjectType, InputType } from "type-graphql";
import { Base } from "./Base";
import { Vehicle } from "./Vehicle";

@ObjectType()
@Entity()
@InputType("VehicleStatusInput")
export class VehicleStatus extends Base {
	@Property()
	@Unique()
	@Field()
	name: string;

	@Property({ nullable: true })
	@Field({ nullable: true })
	description: string;

	@Property({ nullable: true })
	@Field({ nullable: true })
	background: string;

	@OneToMany(() => Vehicle, (vehicle) => vehicle.status)
	@Field(() => [Vehicle])
	vehicles = new Collection<Vehicle>(this);
}
