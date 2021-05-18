import { wrap } from "@mikro-orm/core";
import { VehicleStatus } from "@root/entities/VehicleStatus";
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
class VehicleStatusResponse extends Response(VehicleStatus) {}

// 	@ts-ignore
@ObjectType()
// @ts-ignore
class VehicleStatusTableResponse extends PaginatedResponse(VehicleStatus) {}

@InputType()
class VehicleStatusCreateInput {
	@Field()
	name: string;

	@Field({ nullable: true })
	description?: string;

	@Field({ nullable: true })
	background?: string;
}

@InputType()
class VehicleStatusUpdateInput {
	@Field()
	id: number;

	@Field({ nullable: true })
	name?: string;

	@Field({ nullable: true })
	description?: string;

	@Field({ nullable: true })
	background?: string;
}

@Resolver()
export class VehicleStatusResolver {
	@Query(() => VehicleStatusTableResponse)
	async getVehicleStatuses(
		@Ctx() { em }: MyContext,
		@Arg("inputs", { nullable: true })
		options: QueryOptions
	) {
		const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
		const list_data = await em.find(VehicleStatus, filterBy, {
			limit: perPage,
			offset: perPage * (numPage - 1),
			orderBy: sortBy,
		});
		const total = await em.count(VehicleStatus);
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total,
			},
		};
	}

	@Query(() => VehicleStatusResponse)
	async getVehicleStatus(
		@Ctx() { em }: MyContext,
		@Arg("inputs") id: number
	) {
		const vehicleStatus = await em.findOne(VehicleStatus, { id });
		if (!vehicleStatus) {
			return {
				errors: [
					{
						message: "Không tồn tại trạng thái phương tiện này",
					},
				],
			};
		}
		em.persist(vehicleStatus);
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
			result: vehicleStatus,
		};
	}

	@Mutation(() => VehicleStatusResponse)
	async createVehicleStatus(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: VehicleStatusCreateInput
	) {
		const data = await em.findOne(VehicleStatus, { name: inputs.name });
		if (data) {
			return {
				errors: [
					{
						message: "Đã có trạng thái phương tiện cùng tên trong database!"
					},
				],
			};
		}
		const vehicleStatus = em.create(VehicleStatus, inputs);
		em.persist(vehicleStatus);
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
			result: vehicleStatus,
			message: "Tạo trạng thái phương tiện thành công!"
		};
	}

	@Mutation(() => VehicleStatusResponse)
	async updateVehicleStatus(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: VehicleStatusUpdateInput
	) {
		const vehicleStatus = await em.findOne(VehicleStatus, { id: inputs.id });
		if (!vehicleStatus) {
			return {
				errors: [
					{
						message: "Không tồn tại trạng thái phương tiện này",
					},
				],
			};
		}
		wrap(vehicleStatus).assign({
			...inputs,
		});

		em.persist(vehicleStatus);
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
			result: vehicleStatus,
			message: "Cập nhật thông tin trạng thái phương tiện thành công",
		};
	}

	@Mutation(() => VehicleStatusResponse)
	async deleteVehicleStatus(
		@Ctx() { em }: MyContext,
		@Arg("inputs") id: number
	) {
		const vehicleStatus = await em.findOne(VehicleStatus, { id });
		if(!vehicleStatus) {
			return {
				errors: [
					{
						field: "id",
						message: "Không tồn tại trạng thái phương tiện này",
					},
				],
			};
		}
		em.remove(vehicleStatus);
		try {
			await em.flush();
		} catch (error) {
			return {
				message: error
			}
		}
		return {
			message: "Đã xoá trạng thái phương tiện thành công"
		}
	}
}
