import { wrap } from "@mikro-orm/core";
import { Expense } from "@root/entities/Expense";
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
class ExpenseResponse extends Response(Expense) {}

// 	@ts-ignore
@ObjectType()
// @ts-ignore
class ExpenseTableResponse extends PaginatedResponse(Expense) {}

@InputType()
class ExpenseCreateInput {
	@Field()
	name: string;
}

@InputType()
class ExpenseUpdateInput {
	@Field()
	id: number;

	@Field({ nullable: true })
	name?: string;
}

@Resolver()
export class ExpenseResolver {
	@Query(() => ExpenseTableResponse)
	async getExpenses(
		@Ctx() { em }: MyContext,
		@Arg("inputs", { nullable: true })
		options: QueryOptions
	) {
		const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
		const list_data = await em.find(Expense, filterBy, {
			limit: perPage,
			offset: perPage * (numPage - 1),
			orderBy: sortBy,
		});
		const total = await em.count(Expense);
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total,
			},
		};
	}

	@Query(() => ExpenseResponse)
	async getExpense(@Ctx() { em }: MyContext, @Arg("inputs") id: number) {
		const expense = await em.findOne(Expense, { id });
		if (!expense) {
			return {
				errors: [
					{
						message: "Không tồn tại loại chi phí này",
					},
				],
			};
		}
		em.persist(expense);
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
			result: expense,
		};
	}

	@Mutation(() => ExpenseResponse)
	async createExpense(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: ExpenseCreateInput
	) {
		const data = await em.findOne(Expense, { name: inputs.name }) 
		if (data) 
		return {
			errors: [
				{
					message: "Đã có loại chi phí cùng tên trong database!"
				},
			],
		};

		const expense = em.create(Expense, inputs);
		em.persist(expense);
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
			result: expense,
			message: "Tạo loại chi phí thành công!"
		};
	}

	@Mutation(() => ExpenseResponse)
	async updateExpense(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: ExpenseUpdateInput
	) {
		const expense = await em.findOne(Expense, { id: inputs.id });
		if (!expense) {
			return {
				errors: [
					{
						message: "Không tồn tại loại chi phí này",
					},
				],
			};
		}
		wrap(expense).assign({
			name: inputs.name,
		});

		em.persist(expense);
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
			result: expense,
			message: "Cập nhật thông tin chi phí thành công",
		};
	}

	@Mutation(() => ExpenseResponse)
	async deleteExpense(
		@Ctx() { em }: MyContext,
		@Arg("inputs") id: number
	) {
		const expense = await em.findOne(Expense, { id });
		if(!expense) {
			return {
				errors: [
					{
						field: "id",
						message: "Không tồn tại loại chi phí này",
					},
				],
			};
		}
		em.remove(expense);
		try {
			await em.flush();
		} catch (error) {
			return {
				message: error
			}
		}
		return {
			message: "Đã xoá loại chi phí thành công"
		}
	}

}
