import { Decision } from "@root/entities/Decision";
import { Manager } from "@root/entities/Manager";
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
class DecisionResponse extends Response(Decision) {}

// 	@ts-ignore
@ObjectType()
// @ts-ignore
class DecisionTableResponse extends PaginatedResponse(Decision) {}

@InputType()
class DecisionCreateInput {
	@Field()
	managerId: number;
}

@Resolver()
export class DecisionResolver {
	@Query(() => DecisionTableResponse)
	async getDecisions(
		@Ctx() { em }: MyContext,
		@Arg("inputs", { nullable: true })
		options: QueryOptions
	) {
		const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
		const list_data = await em.find(Decision, filterBy, {
			limit: perPage,
			offset: perPage * (numPage - 1),
			orderBy: sortBy,
		});
		const total = await em.count(Decision);
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total,
			},
		};
	}

	@Mutation(() => DecisionResponse)
	async createDecision(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: DecisionCreateInput
	) {
		const manager = await em.findOne(Manager, { id: inputs.managerId });
		if (!manager) {
			return {
				errors: [
					{
						message: "Không có manager này",
					},
				],
			};
		}
		let decision = new Decision();
		decision.manager = manager;
		em.persist(decision);
		try {
			await em.flush();
		} catch (error) {
			return {
                errors: [
                    {
						message: "Có lỗi trong quá trình cập nhật vào cơ sở dữ liệu",
                    },
                ],
            };
		}
		return {
			result: decision,
		};
	}
}
