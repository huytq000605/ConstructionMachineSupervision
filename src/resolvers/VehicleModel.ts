import { wrap } from "@mikro-orm/core";
import { Manufacturer } from "@root/entities/Manufacturer";
import { Vehicle } from "@root/entities/Vehicle";
import { VehicleModel } from "@root/entities/VehicleModel";
import { MyContext, PaginatedResponse, QueryOptions, Response } from "@root/types";
import mapAsyncAction from "@root/utils/mapAsyncAction";
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

@InputType()
class GetVehicleModelsByManufacturerInput {
	@Field()
	manufacturerName: string;
}

@InputType()
class VehicleModelCreateInput {
	@Field()
	name: string;
	@Field()
	manufacturerName: string;
}

@InputType()
class VehicleModelUpdateInput {
	@Field()
	id: number;
	@Field({ nullable: true })
	name?: string;
	@Field({ nullable: true })
	manufacturernName?: string;
}

@ObjectType()
class VehicleModelCountVehicle extends VehicleModel {
	@Field()
	vehicleCount?: number;
}
// @ts-ignore
@ObjectType()
// @ts-ignore
class VehicleModelResponse extends Response(VehicleModel) {}

// 	@ts-ignore
@ObjectType()
// @ts-ignore
class VehicleModelTableResponse extends PaginatedResponse(VehicleModelCountVehicle) {}

@Resolver()
export class VehicleModelResolver {
	@Query(() => VehicleModelTableResponse)
	async getVehicleModelsByManufacturer(
		@Ctx() { em }: MyContext,
		@Arg("inputs")
		inputs: GetVehicleModelsByManufacturerInput,
		@Arg("options", { nullable: true })
		options: QueryOptions
	) {
		const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
		const manufacturer = await em.findOne(Manufacturer, { name: inputs.manufacturerName });
		if (!manufacturer) {
			return {
				errors: [
					{
						message: "Không tồn tại nhà sản xuất này trong database"
					}
				]
			}
		}
		let list_data: VehicleModelCountVehicle[]  = await em.find(
			VehicleModel,
			{ ...filterBy, manufacturer },
			{
				limit: perPage,
				offset: perPage * (numPage - 1),
				orderBy: sortBy,
			}
		);
		list_data = await mapAsyncAction(list_data, async (data, index) => {
			data.vehicleCount = await em.count(Vehicle, {model: data.id})
			return data;
		}, 20) 
		const total = await em.count(VehicleModel);
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total,
			},
		};
	}

	@Mutation(() => VehicleModelResponse)
	async createVehicleModel(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: VehicleModelCreateInput
	) {
		const data = await em.findOne(VehicleModel, { name: inputs.name });
		if (data) 
		return {
			errors: [
				{
					message: "Đã có Model cùng tên trong database!"
				},
			],
		};

		let vehicleModel = em.create(VehicleModel, inputs);
		const manufacturer = await em.findOne(Manufacturer, {
			name: inputs.manufacturerName,
		});
		if (!manufacturer)
			return {
				errors: [
					{
						message: "Không tồn tại nhà sản xuất này!",
					},
				],
			};
		vehicleModel.manufacturer = manufacturer;
		em.persist(vehicleModel);
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
			result: vehicleModel,
			mesage: "Đã tạo model thành công!"
		};
	}

	@Mutation(() => VehicleModelResponse)
	async updateVehicleModel(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: VehicleModelUpdateInput
	) {
		let vehicleModel = await em.findOne(VehicleModel, { id: inputs.id });
		if (!vehicleModel) {
			return {
				errors: [
					{
						message: "Không tồn tại loại model này",
					},
				],
			};
		}
		if (inputs.manufacturernName) {
			const manufacturer = await em.findOne(Manufacturer, { name: inputs.manufacturernName });
			if (!manufacturer) {
				return {
					errors: [
						{
							message: "Không tồn tại nhà sản xuất này!"
						}
					]
				}
			}
			vehicleModel.manufacturer = manufacturer;
		}
		wrap(vehicleModel).assign({
			...inputs,
		});

		em.persist(vehicleModel);
		try {
			em.flush();
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
			result: vehicleModel,
			message: "Cập nhật thông tin model thành công",
		};
	}
}
