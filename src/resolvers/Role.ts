import { wrap } from "@mikro-orm/core";
import { Permission } from "@root/entities/Permission";
import { Role } from "@root/entities/Role";
import { MyContext, PaginatedResponse, QueryOptions, Response } from "@root/types";
import queryBuilder from "@root/utils/queryBuilder";
import {
	Arg,
	Ctx,
	Field,
	ID,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from "type-graphql";
import { PermissionTableResponse } from "./Permission";

//@ts-ignore
@ObjectType()
//@ts-ignore
class RoleResponse extends Response(Role) {}

//@ts-ignore
@ObjectType()
//@ts-ignore
class RoleTableResponse extends PaginatedResponse(Role) {}

@InputType()
class GetPermissionsByRoleInput { 
	@Field()
	roleName: string;
}

@InputType()
class RoleCreateInput {
	@Field()
	name: string;
	@Field(() => [String], { nullable: true })
	permissionNames: string[]
}

@InputType()
class RoleUpdateInput {
	@Field({ nullable: true })
	id: number;

	@Field({ nullable: true })
	name?: string;

	@Field(() => [String], { nullable: true })
	permissionNames: string[];
}

@Resolver()
export class RoleResolver {
	@Query(() => RoleTableResponse)
	async getRoles(
		@Ctx() { em }: MyContext,
		@Arg("inputs", { nullable: true }) options: QueryOptions
	) {
		const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
		const list_data = await em.find(Role, filterBy, {
			limit: perPage,
			offset: perPage * (numPage - 1),
			orderBy: sortBy,
		});
		const total = await em.count(Role);
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total,
			},
		};
	}

	@Query(() => RoleResponse)
	async getRole(
        @Ctx() { em }: MyContext,
        @Arg("inputs") id: number
    ) {
		const role = await em.findOne(Role, { id });
		if (!role)
			return {
				errors: [
					{
						message: "Không tìm thấy role trong database",
					},
				],
			};
		return {
			result: role,
		};
	}

	@Mutation(() => RoleResponse)
	async createRole(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: RoleCreateInput
	) {
		const data = await em.findOne(Role, { name: inputs.name });
		if (data) 
		return {
			errors: [
				{
					message: "Đã có role cùng tên trong database"
				},
			],
		};

		const role = em.create(Role, inputs);
		for(const permissionName of inputs.permissionNames) {
			const permission = await em.findOne(Permission, { name: permissionName });
			if (!permission) {
				return {
					errors: [
						{
							message: "Không tồn tại permission này"
						}
					]
				}
			}
			role.permissions.add(permission);
		}

		try {
			await em.persistAndFlush(role);
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
            message: "Tạo role mới thành công",
			result: role,
		};
	}

	@Mutation(() => RoleResponse)
	async updateRole(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: RoleUpdateInput
	) {
		let role = await em.findOne(Role, { id: inputs.id });
		if (!role) {
			return {
				errors: [
					{
						message: "Không tồn tại role này trong database"
					}
				]
			}
		}
		if (inputs.permissionNames) {
			await role.permissions.init({ where: {}});
			role.permissions.removeAll();
			for (const permissionName of inputs.permissionNames) {
				const permission = await em.findOne(Permission, { name: permissionName });
				if (!permission)
					return {
						errors: [
							{
								field: "id",
								message: `Không tồn tại permission tên: ${permissionName}`,
							},
						],
					};				
				role.permissions.add(permission);
			}
		}
		wrap(role).assign({
			...inputs,
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
			result: role,
			message: "Cập nhật role thành công"
		};
	}

	@Mutation(() => RoleResponse)
	async deleteRole(
		@Arg("inputs") id: number,
		@Ctx() { em }: MyContext,
	) {
		const role = await em.findOne(Role, {id});
		if(role) {
			em.remove(role)
			await em.flush();
		}
		else {
			return {
				errors: {
					message: "Không tìm thấy role",
					field: "id"
				}
			}
		}
		return {
			message: "Đã xoá role thành công"
		}
	}
	
	@Query(() => PermissionTableResponse)
	async getPermissions(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: GetPermissionsByRoleInput,
		@Arg("options", { nullable: true }) options: QueryOptions
	) {
		const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
		const list_data = await em.find(Permission, { ...filterBy, roles: { name: inputs.roleName }}, {
			limit: perPage,
			offset: perPage * (numPage - 1),
			orderBy: sortBy,
		});
		const total = await em.count(Permission);
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total,
			},
		};
	}
}
