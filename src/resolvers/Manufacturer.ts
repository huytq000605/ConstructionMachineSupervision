import { wrap } from "@mikro-orm/core";
import { Manufacturer } from "@root/entities/Manufacturer";
import { MyContext, QueryOptions, Response, PaginatedResponse } from "@root/types";
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
class ManufacturerResponse extends Response(Manufacturer) {}

// 	@ts-ignore
@ObjectType()
// @ts-ignore
class ManufacturerTableResponse extends PaginatedResponse(Manufacturer) {}

@InputType()
class ManufacturerCreateInput {
	@Field()
	name: string;
}

@InputType()
class ManufacturerUpdateInput {
	@Field()
	id: number;
	@Field({ nullable: true })
	name?: string;
}

@Resolver()
export class ManufacturerResolver {
	@Query(() => ManufacturerTableResponse)
	async getManufacturers(
		@Ctx() { em }: MyContext,
		@Arg("inputs", { nullable: true }) options: QueryOptions
	) {
		const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
		const list_data = await em.find(Manufacturer, filterBy, {
			limit: perPage,
			offSet: perPage * (numPage - 1),
			orderBy: sortBy,
		});
		const total = await em.count(Manufacturer);
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total,
			},
		};
	}

	@Mutation(() => ManufacturerResponse)
	async createManufacturer(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: ManufacturerCreateInput
	) {
		const data = await em.findOne(Manufacturer, { name: inputs.name });
		if (data) 
		return {
			errors: [
				{
					message: "Đã có nhà sản xuất cùng tên trong database!"
				},
			],
		};
		const manufacturer = em.create(Manufacturer, inputs);
		em.persist(manufacturer);
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
			message: "Đã tạo nhà sản xuất thành công!",
			result: manufacturer,
		};
	}

	@Mutation(() => ManufacturerResponse)
	async updateManufacturer(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: ManufacturerUpdateInput
	) {
		let manufacturer = await em.findOne(Manufacturer, { id: inputs.id });
		if (!manufacturer) {
			return {
				errors: [
					{
						message: "Không tồn tại nhà sản xuất này",
					},
				],
			};
		}

		wrap(manufacturer).assign({
			...inputs,
		});

		em.persist(manufacturer);
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
			result: manufacturer,
			message: "Cập nhật thông tin nhà sản xuất thành công",
		};
	}
}
