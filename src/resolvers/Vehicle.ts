import { FilterQuery, wrap } from "@mikro-orm/core";
import { Manufacturer } from "@root/entities/Manufacturer";
import { Vehicle } from "@root/entities/Vehicle";
import { VehicleFuel } from "@root/entities/VehicleFuel";
import { VehicleModel } from "@root/entities/VehicleModel";
import { VehicleStatus } from "@root/entities/VehicleStatus";
import { VehicleType } from "@root/entities/VehicleType";
import { MyContext, PaginatedResponse, QueryOptions, Response } from "@root/types";
import queryBuilder from "@root/utils/queryBuilder";
import {
	Arg,
	Ctx,
	Field,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from "type-graphql";

// @ts-ignore
@ObjectType()
// @ts-ignore
class VehicleResponse extends Response(Vehicle) {}

// @ts-ignore
@ObjectType()
// @ts-ignore
class VehicleTableResponse extends PaginatedResponse(Vehicle) {}

@InputType()
class VehicleCreateInput {
	@Field()
	manufacturerId: number;

	@Field()
	modelId: number;

	@Field()
	vehicleFuelId: number;

	@Field()
	vehicleTypeId: number;

	@Field()
	vehicleStatusId: number;
	
	@Field()
	weight: number;
	
	@Field()
	name: string;

	@Field()
	information: string;

	@Field()
	description?: string;

	@Field()
	maintainTime: number;

	@Field()
	hoursWorked?: number;

	@Field()
	odometer: number;

	@Field()
	guaranteeTime: Date;
}

@InputType()
class GetVehicleByModelInput {
	@Field({ nullable: true })
	modelName!: string;
}

@InputType()
class VehicleEditInput {
	@Field()
	id: number;

	@Field({ nullable: true })
	name?: string;

	@Field({ nullable: true })
	manufacturerId?: number;

	@Field({ nullable: true })
	modelId?: number;

	@Field({ nullable: true })
	vehicleFuelId?: number;
	
	@Field({ nullable: true })
	vehicleTypeId?: number;

	@Field({ nullable: true })
	vehicleStatusId?: number;

	@Field({ nullable: true })
	weight?: number;

	@Field({ nullable: true })
	information?: string;

	@Field({ nullable: true })
	description?: string;

	@Field({ nullable: true })
	maintainTime?: number;

	@Field({ nullable: true })
	hoursWorked?: number;

	@Field({ nullable: true })
	guaranteeTime?: Date;

	@Field({ nullable: true })
	odometer?: number;
}

@InputType()
class VehicleDeleteInput {
	@Field()
	id: number;
}

@Resolver()
export class VehicleResolver {
	@Query(() => VehicleTableResponse)
	async getVehicles(
		@Ctx() { em }: MyContext,
		@Arg("inputs", { nullable: true })
		options: QueryOptions
	) {
		const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
		const list_data = await em.find(Vehicle, filterBy, {
			limit: perPage,
			offset: perPage * (numPage - 1),
			orderBy: sortBy,
		});
		const total = await em.count(Vehicle);
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total,
			},
		};
	}

	@Query(() => VehicleResponse)
	async getVehicle(@Ctx() { em }: MyContext, @Arg("id") id: number) {
		const vehicle = await em.findOne(Vehicle, { id: id });
		if (!vehicle) {
			return {
				errors: [
					{
						message: "Không có phương tiện này trong database",
					},
				],
			};
		}
		return {
			result: vehicle,
		};
	}

	@Query(() => VehicleTableResponse)
	async getVehiclesByModel(
		@Ctx() { em }: MyContext,
		@Arg("inputs", { nullable: true })
		inputs?: GetVehicleByModelInput
	): Promise<Vehicle[]> {
		let where: FilterQuery<Vehicle> = {};
		if (inputs?.modelName) {
			where = {
				...where,
				model: {
					name: inputs.modelName,
				},
			};
		}
		const result = await em.find(Vehicle, where);
		return result;
	}

	@Mutation(() => VehicleResponse)
	async createVehicle(
		@Arg("inputs") inputs: VehicleCreateInput,
		@Ctx() { em }: MyContext
	) {
		const manufacturer = await em.findOne(Manufacturer, {
			id: inputs.manufacturerId,
		});

		if (!manufacturer) {
			return {
				errors: [
					{
						message: "Không tồn tại nhà sản xuất này",
					},
				],
			};
		}

		const vehicleModel = await em.findOne(VehicleModel, {
			id: inputs.modelId,
		});

		if (!vehicleModel) {
			return {
				errors: [
					{
						message: "Không tồn tại model này",
					},
				],
			};
		}

		const vehicleFuel = await em.findOne(VehicleFuel, {
			id: inputs.vehicleFuelId,
		});

		if (!vehicleFuel) {
			return {
				errors: [
					{
						message: "Không tồn tại loại nhiên liệu này",
					},
				],
			};
		}

		const vehicleType = await em.findOne(VehicleType, {
			id: inputs.vehicleTypeId,
		});

		if (!vehicleType) {
			return {
				errors: [
					{
						message: "Không tồn tại loại phương tiện này",
					},
				],
			};
		}

		const vehicleStatus = await em.findOne(VehicleStatus, {
			id: inputs.vehicleStatusId,
		});

		if (!vehicleStatus) {
			return {
				errors: [
					{
						message: "Không tồn tại trạng thái phương tiện này",
					},
				],
			};
		}

		let vehicle = em.create(Vehicle, inputs);

		vehicle.manufacturer = manufacturer;
		vehicle.model = vehicleModel;
		vehicle.fuel = vehicleFuel;
		vehicle.type = vehicleType;
		vehicle.status = vehicleStatus;
		em.persist(vehicle);

		try {
			await em.flush();
		} catch (error) {
			return {
				errors: [
					{
						message: error,
					},
				],
			};
		}
		return {
			result: vehicle,
		};
	}

	@Mutation(() => VehicleResponse)
	async updateVehicle(
		@Arg("inputs") inputs: VehicleEditInput,
		@Ctx() { em }: MyContext
	) {
		let vehicle = await em.findOne(Vehicle, { id: inputs.id });
		if (!vehicle) {
			return {
				errors: [
					{
						message: "Không tồn tại tài xế này",
					},
				],
			};
		}
		if (inputs.manufacturerId) {
			const manufacturer = await em.findOne(Manufacturer, {
				id: inputs.manufacturerId,
			});
			if (!manufacturer) {
				return {
					errors: [
						{
							message: "Không tồn tại nhà sản xuất này",
						},
					],
				};
			}
			vehicle.manufacturer = manufacturer;
		}

		if (inputs.modelId) {
			const vehicleModel = await em.findOne(VehicleModel, {
				id: inputs.modelId,
			});
			if (!vehicleModel) {
				return {
					errors: [
						{
							message: "Không tồn tại model này",
						},
					],
				};
			}
			vehicle.model = vehicleModel;
		}

		if (inputs.vehicleFuelId) {
			const vehicleFuel = await em.findOne(VehicleFuel, {
				id: inputs.vehicleFuelId,
			});
	
			if (!vehicleFuel) {
				return {
					errors: [
						{
							message: "Không tồn tại loại nhiên liệu này",
						},
					],
				};
			}
			vehicle.fuel = vehicleFuel;
		}

		if (inputs.vehicleTypeId) {
			const vehicleType = await em.findOne(VehicleType, {
				id: inputs.vehicleTypeId,
			});
	
			if (!vehicleType) {
				return {
					errors: [
						{
							message: "Không tồn tại loại phương tiện này",
						},
					],
				};
			}
			vehicle.type = vehicleType;
		}
		
		const vehicleStatus = await em.findOne(VehicleStatus, {
			id: inputs.vehicleStatusId,
		});

        if (inputs.vehicleStatusId) {
            if (!vehicleStatus) {
                return {
                    errors: [
                        {
                            message: "Không tồn tại loại trạng thái phương tiện này",
                        },
                    ],
                };
            }
            vehicle.status = vehicleStatus;
        }
		
		wrap(vehicle).assign({
			...inputs,
		});
		em.persist(vehicle);
		try {
			await em.flush();
		} catch (error) {
			return {
				errors: [
					{
						message: error,
					},
				],
			};
		}
		return {
			result: vehicle,
		};
	}

	@Mutation(() => VehicleResponse)
	async deleteVehicle(
		@Arg("inputs") inputs: VehicleDeleteInput,
		@Ctx() { em }: MyContext
	) {
		const deleteVehicle = await em.findOne(Vehicle, {
			id: inputs.id,
		});
		if (!deleteVehicle) {
			return {
				errors: [
					{
						message: "Không tồn tại phương tiện này",
					},
				],
			};
		}
		em.persist(deleteVehicle);
		await em.remove(deleteVehicle).flush();

		return {
			result: deleteVehicle,
		};
	}
}
