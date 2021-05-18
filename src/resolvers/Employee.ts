import { Driver } from "@root/entities/Driver";
import { Employee } from "@root/entities/Employee";
import { Manager } from "@root/entities/Manager";
import { Place } from "@root/entities/Employee"
import { MyContext, PaginatedResponse, QueryOptions, Response } from "@root/types";
import queryBuilder from "@root/utils/queryBuilder";
import {
	Arg,
	Ctx,
	Field,
	Info,
	InputType,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from "type-graphql";
import { wrap } from "@mikro-orm/core";
/*TO DO:
    Lấy được key của class để làm code gọn & dễ maintain
*/

// @ts-ignore
@ObjectType()
// @ts-ignore
class EmployeeResponse extends Response(Employee) {}

// 	@ts-ignore
@ObjectType()
// @ts-ignore
class EmployeeTableResponse extends PaginatedResponse(Employee) {}

@InputType()
class EmployeeCreateInput {
    @Field()
    name: string;

    @Field({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    address?: Place;

    @Field({ nullable: true })
    dateOfBirth?: string; // validate dd-mm-yyyy or dd/mm/yyyy

    @Field({nullable: true})
    salary?: number;

    @Field({nullable: true})
    unit?: string;

    @Field(() => String, { nullable: true })
    startWork?: Date;

    @Field(() => String, { nullable: true })
    endWork?: Date;
}

@InputType()
class DriverEmployeeCreateInput extends EmployeeCreateInput {
    @Field({ nullable: true })
    licenseNumber?: string;

    @Field({ nullable: true })
    licenseClass?: string;

    @Field({ nullable: true })
    licenseWhere?: string;
}

@InputType()
class ManagerEmployeeCreateInput extends EmployeeCreateInput {
}

@InputType()
class EmployeeUpdateInput {
	@Field()
	id?: number; // delete operation so need "?"

    @Field({ nullable: true})
    name?: string;

    @Field({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    address?: Place;

    @Field({ nullable: true })
    dateOfBirth?: string; // validate dd-mm-yyyy or dd/mm/yyyy

    @Field({nullable: true})
    salary?: number;

    @Field({nullable: true})
    unit?: string;

    @Field(() => String, { nullable: true })
    startWork?: Date;

    @Field(() => String, { nullable: true })
    endWork?: Date;

    @Field({ nullable: true })
    licenseNumber?: string;

    @Field({ nullable: true })
    licenseClass?: string;

    @Field({ nullable: true })
    licenseWhere?: string;
}

@Resolver()
export class EmployeeResolver {
	@Query(() => EmployeeTableResponse)
	async getEmployees(
		@Ctx() { em }: MyContext,
		@Arg("inputs", { nullable: true })
		options: QueryOptions
	) {
		const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
		const list_data = await em.find(Employee, filterBy, {
			// populate: relationPaths,
			limit: perPage,
			offset: perPage * (numPage - 1),
			orderBy: sortBy,
		});
		const total = await em.count(Employee);
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total,
			},
		};
	}

	@Query(() => EmployeeTableResponse)
	async getDriverEmployees( @Ctx() { em }: MyContext,
		@Arg("inputs", {nullable: true}) options: QueryOptions
	) {
		const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
		const list_data = await em.find(
            Employee,
            { ...filterBy, manager: null },
            {
                // populate: relationPaths,
                limit: perPage,
                offset: perPage * (numPage - 1),
                orderBy: sortBy,
            }
        );
		const total = await em.count(Employee, {manager: null});
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total,
			},
		};
	}

	@Query(() => EmployeeTableResponse)
	async getManagerEmployees( @Ctx() { em }: MyContext,
		@Arg("inputs", {nullable: true}) options: QueryOptions
	) {
		const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
		const list_data = await em.find(
            Employee,
            { ...filterBy, driver: null },
            {
                // populate: relationPaths,
                limit: perPage,
                offset: perPage * (numPage - 1),
                orderBy: sortBy,
            }
        );
		const total = await em.count(Employee, { driver: null });
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total,
			},
		};
	}

	@Query(() => EmployeeResponse)
	async getEmployee(
		@Ctx() { em }: MyContext,
		@Arg('inputs') id: number
	) {
		const employee = await em.findOne(Employee, { id });
		if(!employee) {
			return {
				errors: {
					message: "Không tồn tại nhân viên này",
					field: "id"
				}
			}
		}
		else {
			return {
				result: employee
			}
		}
	}

	@Mutation(() => EmployeeResponse)
	async createDriverEmployee(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: DriverEmployeeCreateInput
	) {
		const driver = new Driver();
        const { licenseNumber, licenseClass, licenseWhere} = inputs
        driver.licenseClass = licenseClass;
        driver.licenseNumber = licenseNumber;
        driver.licenseWhere = licenseWhere
        delete inputs.licenseClass;
        delete inputs.licenseNumber;
        delete inputs.licenseWhere;

		const employee = new Employee()

		employee.address = JSON.stringify(inputs.address);
		delete inputs.address;

		for (const [key, value] of Object.entries(inputs)) {
			(employee as any)[key] = value;
		}
		employee.driver = driver;
		
		em.persist(employee);
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
			result: employee,
			message: "Tạo thành công tài khoản tài xế thành công!"
		};
	}

    @Mutation(() => EmployeeResponse)
	async createManagerEmployee(
		@Ctx() { em }: MyContext,
		@Arg("inputs") inputs: ManagerEmployeeCreateInput
	) {
		const manager = new Manager();
		const employee = new Employee()

		employee.address = JSON.stringify(inputs.address);
		delete inputs.address;
		
		for (const [key, value] of Object.entries(inputs)) {
			(employee as any)[key] = value;
		}
		employee.manager = manager;
		em.persist(employee);
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
			result: employee,
			message: "Tạo tài khoản quản lí thành công!"
		};
	}

	@Mutation(() => EmployeeResponse)
    async updateEmployee(
        @Arg('inputs') inputs: EmployeeUpdateInput,
        @Ctx() { em } : MyContext
    ) {
            const employee = await em.findOne(Employee, { id: inputs.id });
            if(!employee) return {
                errors: {
                    message: "Không tồn tại nhân viên này",
                    field: "id"
                }
            }
            delete inputs.id;
            if(employee.driver) {
                employee.driver.licenseClass = inputs.licenseClass;
                employee.driver.licenseNumber = inputs.licenseNumber;
                employee.driver.licenseWhere = inputs.licenseWhere
            }
			if (inputs.address)
			employee.address = JSON.stringify(inputs.address);
			delete inputs.address;
            delete inputs.licenseClass;
            delete inputs.licenseNumber;
            delete inputs.licenseWhere;

            for(const [key,value] of Object.entries(inputs)) {
                (employee as any)[key] = value;
            }
            try {
                await em.persistAndFlush(employee)
            }
            catch(error) {
                return {
                    errors: [
                        {
                            message: error,
                        }
                    ]
                }
            }
            return {
                message: "Cập nhật thông tin nhân viên thành công"
            }
    }

	@Mutation(() => EmployeeResponse)
	async deleteEmployee(
		@Arg('inputs') id: number,
		@Ctx() {em}: MyContext
	) {
		const employee = await em.findOne(Employee, { id });
		if(employee) {
			em.remove(employee)
			await em.flush();
		}
		else {
			return {
				errors: {
					message: "Không tìm thấy nhân viên",
					field: "id"
				}
			}
		}
		return {
			message: "Đã xoá nhân viên thành công"
		}
	}
}
