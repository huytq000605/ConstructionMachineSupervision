import {MaintainTask} from "@root/entities/MaintainTask"
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

//@ts-ignore
@ObjectType()
//@ts-ignore
class MaintainTaskResponse extends Response(MaintainTask) {}

//@ts-ignore
@ObjectType()
//@ts-ignore
class MaintainTaskTableResponse extends PaginatedResponse(MaintainTask) {}

@InputType()
class createMaintainTaskInput{
    @Field()
    name: string
    @Field()
    description: string
}
@InputType()
class updateMaintainTaskInput{
    @Field()
    id: number
    @Field({nullable:true})
    newName: string
    @Field({nullable:true})
    newDescription: string
}
@InputType()
class deleteMaintainTaskInput{
    @Field({nullable:true})
    id: number
}
@Resolver()
export class MaintainTaskResolver{
    @Query(()=>MaintainTaskTableResponse)
	async getMaintainTaskByName(
		@Ctx() {em} : MyContext,
		@Arg("inputs",{nullable:true}) maintainTaskName: string
	) {
		const list_data = await em.find(MaintainTask, {name: maintainTaskName});
		let perPage = 1;
		let numPage = 20;
		let total = await em.count(MaintainTask, {name: maintainTaskName});
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total
			}
		}
	}
    @Query(()=>MaintainTaskTableResponse)
    async getMaintainTaskTable(
        @Ctx() {em}:MyContext,
        @Arg("inputs", {nullable:true}) options: QueryOptions,
    ) {
        if(!options)
            return {
                errors: [
                    {
                        message: "Không có dữ liệu đầu vào!"
                    }
                ]
            }
        const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
        const list_data = await em.find(MaintainTask, filterBy, {
            limit: perPage,
			offset: perPage * (numPage - 1),
			orderBy: sortBy,
        });
        const total = await em.count(MaintainTask, filterBy);
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total
			}
		}
    }
    @Mutation(()=>MaintainTaskResponse)
    async createMaintainTask(
        @Ctx() {em} :MyContext,
        @Arg("inputs",{nullable:true}) createMaintainTaskInput?:createMaintainTaskInput
    ) {
        if (!createMaintainTaskInput)
            return {
                errors: [
                    {
                        message: "Không có dữ liệu đầu vào!"
                    }
                ]
            }
        let newMaintainTask = em.create(MaintainTask, createMaintainTaskInput);
        em.persist(newMaintainTask);
        try{
            await em.flush()
        } catch(error){
            console.log(error);
            return {
				errors: [
					{
						message: "error",
					},
				],
			};
        }
        return{
            resullt: newMaintainTask
        }
    }
    async updateMaintainTask(
        @Ctx() {em}:MyContext,
        @Arg("inputs", {nullable:true}) updateMaintainTaskInput?: updateMaintainTaskInput,
    ) {
        if(!updateMaintainTaskInput)
            return {
                errors: [
                    {
                        message: "Không có dữ liệu đầu vào!"
                    }
                ]
            }
        let updatedMaintainTask = await em.findOne(MaintainTask, {id: updateMaintainTaskInput.id})
        if(!updatedMaintainTask)
            return {
                errors: [
                    {
                        message: "Không tìm thấy MaintainTask!"
                    }
                ]
            }
        if (updateMaintainTaskInput.newName)
            updatedMaintainTask.name = updateMaintainTaskInput.newName;
        if (updateMaintainTaskInput.newDescription)
            updatedMaintainTask.description = updateMaintainTaskInput.newDescription;
        em.persist(updatedMaintainTask);
        try{
            await em.flush()
        } catch(error){
            console.log(error);
            return {
				errors: [
					{
						message: "error",
					},
				],
			};
        }
        return{
            resullt: updatedMaintainTask
        }
    }
    async deleteMaintainTask(
        @Ctx() {em}:MyContext,
        @Arg("inputs", {nullable:true}) deleteMaintainTaskInput?: deleteMaintainTaskInput,
    ) {
        if(!deleteMaintainTaskInput)
            return {
                errors: [
                    {
                        message: "Không có dữ liệu đầu vào!"
                    }
                ]
            }
        let deletedMaintainTask = await em.findOne(MaintainTask, {id:deleteMaintainTaskInput.id})
		if (!deletedMaintainTask)
            return {
                errors: [
                    {
                        message: "Không tìm thấy MaintainTask!"
                    }
                ]
            }
        em.persist(deletedMaintainTask);
        try{
            await em.removeAndFlush(deletedMaintainTask);
        } catch(error){
            console.log(error);
            return {
				errors: [
					{
						message: "error",
					},
				],
			};
        }
        return{
            resullt: deletedMaintainTask
        }
    }
} 
