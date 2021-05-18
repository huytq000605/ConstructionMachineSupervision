import { wrap } from "@mikro-orm/core";
import { Decision } from "@root/entities/Decision";
import { Driver } from "@root/entities/Driver";
import { Manager } from "@root/entities/Manager";
import { MobilizationSession } from "@root/entities/MobilizationSession";
import { Project } from "@root/entities/Project";
import { Vehicle } from "@root/entities/Vehicle";
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
class MobilizationSessionResponse extends Response(MobilizationSession) {}
// @ts-ignore
@ObjectType()
// @ts-ignore
class MobilizationSessionTableResponse extends PaginatedResponse(
	MobilizationSession
) {}

@InputType()
class MobilizationSessionCreateInput {
	@Field()
	driverId: number;

	@Field()
	decisionId: number;

	@Field()
	vehicleId: number;

	@Field({ nullable: true })
	projectId?: number;

	@Field()
	start: Date;

	@Field()
	end: Date;

	@Field()
	startOdometer: number;

	@Field({ nullable: true })
	endOdometer: number;

	@Field()
	pending: boolean;

	@Field({ nullable: true })
	description?: string;
}

@InputType()
class MobilizationSessionEditInput {
	@Field()
	id!: number;

	@Field({ nullable: true })
	start?: Date;

	@Field({ nullable: true })
	end?: Date;

	@Field({ nullable: true })
	startOdometer?: number;

	@Field({ nullable: true })
	endOdometer?: number;

	@Field({ nullable: true })
	pending?: boolean;

	@Field({ nullable: true })
	description?: string;

	@Field({ nullable: true })
	driverId?: number;

	@Field({ nullable: true })
	managerId?: number;

	@Field({ nullable: true })
	vehicleId?: number;

	@Field({ nullable: true })
	projectId?: number;
}
@Resolver()
export class MobilizationSessionResolver {
	@Query(() => MobilizationSessionResponse)
	async getMobilizationSession(
		@Ctx() { em }: MyContext,
		@Arg("inputs") id: number
	) {
		const mobilizationSession = await em.findOne(MobilizationSession, {
			id: id,
		});
		return mobilizationSession;
	}

	@Query(() => MobilizationSessionTableResponse)
	async getMobilizationSessions(
		@Ctx() { em }: MyContext,
		@Arg("inputs", { nullable: true }) options: QueryOptions
	) {
		const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
		const list_data = await em.find(MobilizationSession, filterBy, {
			limit: perPage,
			offSet: perPage * (numPage - 1),
			orderBy: sortBy,
		});
		const total = await em.count(MobilizationSession);
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total,
			},
		};
	}

	@Mutation(() => MobilizationSessionResponse)
	async createMobilizationSession(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: MobilizationSessionCreateInput
	) {
		let mobilizationSession = em.create(MobilizationSession, inputs);
		if (inputs.projectId) {
			const project = await em.findOne(Project, { id: inputs.projectId });
			if (!project) {
				return {
					errors: [
						{
							message: "Không tồn tại dự án này",
						},
					],
				};
			}
			mobilizationSession.project = project;
		}
		const driver = await em.findOne(Driver, { id: inputs.driverId });
		const decision = await em.findOne(Decision, { id: inputs.decisionId });
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
		if (!decision) {
			return {
				errors: [
					{
						message: "Không tồn tại quyết định này",
					},
				],
			};
		}
		if (!driver) {
			return {
				errors: [
					{
						message: "Không tồn tại tài xế này",
					},
				],
			};
		}

		mobilizationSession.driver = driver;
		mobilizationSession.decision = decision;
		mobilizationSession.vehicle = vehicle;

		em.persist(mobilizationSession);

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
			result: mobilizationSession,
		};
	}

	@Mutation(() => MobilizationSessionResponse)
	async updateMobilizationSession(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: MobilizationSessionEditInput
	) {
		const mobilizationSession = await em.findOne(MobilizationSession, {
			id: inputs.id,
		});
		const driver = await em.findOne(Driver, { id: inputs.driverId });
		const project = await em.findOne(Project, { id: inputs.projectId });
		const manager = await em.findOne(Manager, { id: inputs.managerId });
		const vehicle = await em.findOne(Vehicle, { id: inputs.vehicleId });
		wrap(mobilizationSession).assign({
			...inputs,
			driver: driver,
			project: project,
			manager: manager,
			vehicle: vehicle,
		});
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
			result: mobilizationSession,
		};
	}

	@Mutation(() => MobilizationSessionResponse)
	async completeMobilizationSession(
		@Arg("inputs") id: number,
		@Ctx() {em} : MyContext,
	) {
		const session = await em.findOne(MobilizationSession, {id});
		if(!session) return {
			errors: [
				{
					message: "Không tồn tại phiên điều động này",
					field: "id"
				},
			],
		};
		session.pending = true;
		await em.persistAndFlush(session)
		return {
			message: "Xoá phiên điều động thành công"
		}
	}
}
