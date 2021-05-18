import {
	Collection,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	Property,
} from "@mikro-orm/core";
import { Field, ObjectType, InputType } from "type-graphql";
import { Base } from "./Base";
import { Expense } from "./Expense";
import { MaintainProgram } from "./MaintainProgram";
import { Manufacturer } from "./Manufacturer";
import { MobilizationSession } from "./MobilizationSession";
import { VehicleFuel } from "./VehicleFuel";
import { VehicleModel } from "./VehicleModel";
import { VehicleStatus } from "./VehicleStatus";
import { VehicleType } from "./VehicleType";

@ObjectType()
@Entity()
@InputType("VehicleInput")
export class Vehicle extends Base {
	@Property()
	@Field()
	name!: string;
	
	@Field()
	@Property()
	weight!: number;

	@Property()
	@Field()
	information: string;

	@Property()
	@Field()
	description: string;

	@Property()
	@Field()
	maintainTime: number; // Số ngày làm việc giữa 2 lần bảo dưỡng

	@Property()
	@Field()
	hoursWorked: number; // Số giờ hoạt động sau lần bảo dưỡng gần nhất

	@Property()
	@Field()
	guaranteeTime: Date; // Mốc thời gian kết thúc bảo hành

	@Property()
	@Field()
	odometer: number;

	@Property()
	@Field()
	speed: number;

	@Property()
	@Field()
	vin: string;

	@Property()
	@Field()
	license_plate: string;

	@Property()
	@Field()
	year: string;

	@Property()
	@Field()
	runTime: number;

	@Field(() => Manufacturer)
	@ManyToOne(() => Manufacturer)
	manufacturer!: Manufacturer;

	@Field(() => VehicleModel)
	@ManyToOne(() => VehicleModel)
	model!: VehicleModel;

	@Field(() => VehicleStatus)
	@ManyToOne(() => VehicleStatus)
	status!: VehicleStatus;

	@Field(() => VehicleFuel)
	@ManyToOne(() => VehicleFuel)
	fuel!: VehicleFuel;

	@Field(() => VehicleType)
	@ManyToOne(() => VehicleType)
	type!: VehicleType;

	@ManyToMany(() => Expense, (expense) => expense.vehicles, { owner: true })
    @Field(() => [Expense])
    expenses = new Collection<Expense>(this);

	@OneToMany(
		() => MobilizationSession,
		(mobilizationSession) => mobilizationSession.vehicle
	)
	@Field(() => [MobilizationSession])
	mobilizationSessions = new Collection<MobilizationSession>(this);

	@ManyToMany(() => MaintainProgram, (maintainProgram) => maintainProgram.vehicles, { owner: true })
    @Field(() => [MaintainProgram])
    maintainPrograms = new Collection<MaintainProgram>(this);
}
