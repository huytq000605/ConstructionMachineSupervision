import { wrap } from "@mikro-orm/core";
import { Issue } from "@root/entities/Issue";
import { MyContext, PaginatedResponse, QueryOptions, Response} from "@root/types";
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
import { Vehicle } from "@root/entities/Vehicle";
import { Label } from "@root/entities/Label";
import { Employee } from "@root/entities/Employee";

//@ts-ignore
@ObjectType()
//@ts-ignore
class IssueResponse extends Response(Issue) {}

//@ts-ignore
@ObjectType()
//@ts-ignore
class IssueTableResponse extends PaginatedResponse(Issue) {}

@InputType()
class IssueCreateInput {
	@Field()
	description!: string;

	@Field()
	vehicleId!: number;

	@Field(() => [Number])
	labelIds!: number[];

	@Field({ nullable: true })
	assigneeId: number;
}

@InputType()
class IssueUpdateInput {
	@Field()
	id!: number;

	@Field({ nullable: true })
	description?: string;

	@Field({ nullable: true })
	vehicleId?: number;

	@Field(() => [Number], { nullable: true })
	labelIds?: number[];

	@Field({ nullable: true })
	assgineeId?: number;
}

@Resolver()
export class IssueResolver {
	@Query(() => IssueTableResponse)
	async getIssues(
		@Ctx() { em }: MyContext,
		@Arg("inputs", { nullable: true }) options: QueryOptions
	) {
		const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
		const list_data = await em.find(Issue, filterBy, {
			limit: perPage,
			offset: perPage * (numPage - 1),
			orderBy: sortBy,
		});
		const total = await em.count(Issue);
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total,
			},
		};
	}

	@Query(() => IssueResponse)
	async getIssue(@Ctx() { em }: MyContext, @Arg("id") id: number) {
		const issue = await em.findOne(Issue, { id: id });
		if (!issue)
			return {
				errors: [
					{
						message: "Không tìm thấy Issue này",
					},
				],
			};
		return {
			result: issue,
		};
	}

	@Mutation(() => IssueResponse)
	async createIssue(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: IssueCreateInput
	) {
		const vehicle = await em.findOne(Vehicle, { id: inputs.vehicleId });
		if (!vehicle) {
			return {
				errors: [
					{
						message: "Không tồn tại phương tiện này",
					},
				],
			};
		}		
		let issue = new Issue();

		for (const labelId of inputs.labelIds) {
			const label = await em.findOne(Label, { id: labelId });
			if (!label)
				return {
					errors: [
						{
							field: "id",
							message: `Không tồn tại label id: ${labelId}`,
						},
					],
				};
			issue.labels.add(label);
		}

		issue.description = inputs.description;
		issue.vehicle = vehicle;

		em.persist(issue);
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
			result: issue,
		};
	}

	@Mutation(() => IssueResponse)
	async updateIssue(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: IssueUpdateInput
	) {
		let issue = await em.findOne(Issue, { id: inputs.id });
		if (!issue) {
			return {
				errors: [
					{
						field: "id",
						message: "Không tồn tại Issue này",
					},
				],
			};
		}
		if (inputs.assgineeId) {
			const assignee = await em.findOne(Employee, {
				id: inputs.assgineeId,
			});
			if (!assignee) {
				return {
					errors: [
						{
							field: "id",
							message: "Không tồn tại nhân viên này",
						},
					],
				};
			}
			await issue.assignees.init({ where: {}});
			issue.assignees.removeAll();
			issue.assignees.add(assignee);
		}

		if (inputs.vehicleId) {
			const vehicle = await em.findOne(Vehicle, {
				id: inputs.vehicleId,
			});
			if (!vehicle) {
				return {
					errors: [
						{
							field: "id",
							message: "Không tồn tại phương tiện này",
						},
					],
				};
			}
			issue.vehicle = vehicle;
		}

		if (inputs.labelIds) {
			await issue.labels.init({ where: {}});
			issue.labels.removeAll();
			for (const labelId of inputs.labelIds) {
				const label = await em.findOne(Label, { id: labelId });
				if (!label)
					return {
						errors: [
							{
								field: "id",
								message: `Không tồn tại label id: ${labelId}`,
							},
						],
					};				
				issue.labels.add(label);
			}
		}

		wrap(issue).assign({
			...inputs,
		});

		em.persist(issue);

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
			result: issue,
			message: "Cập nhật thông tin Issue thành công",
		};
	}

	@Mutation(() => IssueResponse)
	async deleteIssue(@Arg("inputs") id: number, @Ctx() { em }: MyContext) {
		const issue = await em.findOne(Issue, { id });
		if (!issue)
			return {
				errors: {
					message: "Không tồn tại Issue này",
					field: "id",
				},
			};
		await em.remove(Issue).flush();
		return {
			message: "Xoá Issue thành công",
		};
	}
}
