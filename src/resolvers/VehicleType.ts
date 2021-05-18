import { wrap } from "@mikro-orm/core";
import { Vehicle } from "@root/entities/Vehicle";
import { VehicleType } from "@root/entities/VehicleType";
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
@ObjectType()
class VehicleTypeCountVehicle extends VehicleType {
	@Field()
	vehicleCount?: number;
}

// @ts-ignore
@ObjectType()
// @ts-ignore
class VehicleTypeResponse extends Response(VehicleType) {}

// 	@ts-ignore
@ObjectType()
// @ts-ignore
class VehicleTypeTableResponse extends PaginatedResponse(VehicleTypeCountVehicle) {}

@InputType()
class VehicleTypeCreateInput {
	@Field()
	name!: string;
}

@InputType()
class VehicleTypeUpdateInput {
	@Field()
	id!: number;
	@Field()
	name: string;
}

@Resolver()
export class VehicleTypeResolver {
	@Query(() => VehicleTypeTableResponse)
	async getVehicleTypes(
		@Ctx() { em }: MyContext,
		@Arg("inputs", { nullable: true })
		options: QueryOptions
	) {
		const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
		let list_data: VehicleTypeCountVehicle[] = await em.find(VehicleType, {...filterBy}, {
			limit: perPage,
			offset: perPage * (numPage - 1),
			orderBy: sortBy,
		});
		list_data = await mapAsyncAction(list_data, async (data, index) => {
			data.vehicleCount = await em.count(Vehicle, {type: data.id})
			return data;
		}, 20) 
		const total = await em.count(VehicleType);
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total,
			},
		};
	}

	@Query(() => VehicleTypeResponse)
	async getVehicleType(@Ctx() { em }: MyContext, @Arg("inputs") id: number) {
		const vehicleType = await em.findOne(VehicleType, { id });
		if (!vehicleType) {
			return {
				errors: [
					{
						message: "Không tồn tại loại phương tiện này",
					},
				],
			};
		}
		em.persist(vehicleType);
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
			result: vehicleType,
		};
	}

	@Mutation(() => VehicleTypeResponse)
	async createVehicleType(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: VehicleTypeCreateInput
	) {
		const data = await em.findOne(VehicleType, { name: inputs.name });
		if (data) {
			return {
				errors: [
					{
						message: "Đã có loại phương tiện cùng tên trong database!"
					}
				]
			}
		}
		const vehicleType = em.create(VehicleType, inputs);
		em.persist(vehicleType);
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
			message: "Tạo loại phương tiện mới thành công!",
			result: vehicleType,
		};
	}

	@Mutation(() => VehicleTypeResponse)
	async updateVehicleType(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: VehicleTypeUpdateInput
	) {
		const vehicleType = await em.findOne(VehicleType, { id: inputs.id });
		if (!vehicleType) {
			return {
				errors: [
					{
						message: "Không tồn tại loại phươnhg tiện này",
					},
				],
			};
		}
		wrap(vehicleType).assign({
			...inputs,
		});
		em.persist(vehicleType);
		
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
			message: "Cập nhật thông tin phương tiện thành công",
			result: vehicleType,
		};
	}

	@Mutation(() => VehicleTypeResponse)
	async deleteVehicleType(
		@Ctx() { em }: MyContext,
		@Arg("inputs") id: number
	) {
		const vehicleType = await em.findOne(VehicleType, { id });
		if(!vehicleType) {
			return {
				errors: [
					{
						field: "id",
						message: "Không tồn tại loại phương tiện này",
					},
				],
			};
		}
		em.remove(vehicleType);
		try {
			await em.flush();
		} catch (error) {
			return {
				message: error
			}
		}
		return {
			message: "Đã xoá loại phương tiện thành công"
		}
	}
}
