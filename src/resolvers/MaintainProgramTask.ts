import {MaintainProgramTask} from "@root/entities/MaintainProgramTask"
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
import {MaintainProgram} from "@root/entities/MaintainProgram"
import {MaintainTask} from "@root/entities/MaintainTask"
//@ts-ignore
@ObjectType()
//@ts-ignore
class MaintainProgramTaskResponse extends Response(MaintainProgramTask) {}

//@ts-ignore
@ObjectType()
//@ts-ignore
class MaintainProgramTaskTableResponse extends PaginatedResponse(MaintainProgramTask) {}

@InputType()
class createMaintainProgramTaskInput{
    @Field({nullable:true})
    timeThreshold: number
    @Field({nullable:true})
    distanceThreshold: number
    @Field()
    done: boolean;
    @Field({nullable:true})
    maintainTaskId: number;
    @Field({nullable:true})
    maintainProgramId: number;
}
@InputType()
class updateMaintainProgramTaskInput{
    @Field()
    id: number;
    @Field({nullable:true})
    newTimeThreshold: number
    @Field({nullable:true})
    newDistanceThreshold: number
    @Field({nullable:true})
    newState: boolean;
    @Field({nullable:true})
    newMaintainTaskId: number;
    @Field({nullable:true})
    newMaintainProgramId: number;
}
@InputType()
class deleteMaintainProgramTaskInput{
    @Field({nullable:true})
    id: number
}

@Resolver()
export class MaintainProgramTaskResolver{
    @Query(()=>MaintainProgramTaskTableResponse)
	async getMaintainProgramTaskByMaintainTask(
		@Ctx() {em} : MyContext,
		@Arg("inputs",{nullable:true}) maintainTaskId: number
	) {
		const maintainTask = await em.findOne(MaintainTask, {id: maintainTaskId});
        if (!maintainTask)
            return {
                errors: [
                    {
                        message: "Không tìm thấy MaintainTask!"
                    }
                ]
            }
		const list_data = await em.find(MaintainProgramTask, {maintainTask: maintainTask});
		let perPage = 1;
		let numPage = 20;
		let total = await em.count(MaintainProgramTask, {maintainTask: maintainTask});
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total
			}
		}
	}
    @Query(()=>MaintainProgramTaskTableResponse)
	async getMaintainProgramTaskByMaintainProgram(
		@Ctx() {em} : MyContext,
		@Arg("inputs",{nullable:true}) maintainProgramId: number
	) {
		const maintainProgram = await em.findOne(MaintainProgram, {id: maintainProgramId});
        if (!maintainProgram)
            return {
                errors: [
                    {
                        message: "Không tìm thấy MaintainProgram!"
                    }
                ]
            }
		const list_data = await em.find(MaintainProgramTask, {maintainProgram: maintainProgram});
		let perPage = 1;
		let numPage = 20;
		let total = await em.count(MaintainProgramTask, {maintainProgram: maintainProgram});
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total
			}
		}
	}
    @Mutation(()=>MaintainProgramTaskResponse)
    async createMaintainProgram(
        @Ctx() {em} :MyContext,
        @Arg("inputs",{nullable:true}) createMaintainProgramTaskInput?:createMaintainProgramTaskInput
    ) {
        if (!createMaintainProgramTaskInput)
            return {
                errors: [
                    {
                        message: "Không có dữ liệu đầu vào!"
                    }
                ]
            }
        let newMaintainProgramTask = em.create(MaintainProgramTask, createMaintainProgramTaskInput);
        em.persist(newMaintainProgramTask);
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
            resullt: newMaintainProgramTask
        }
    }
    async updateMaintainProgramTask(
        @Ctx() {em}:MyContext,
        @Arg("inputs", {nullable:true}) updateMaintainProgramTaskInput?: updateMaintainProgramTaskInput,
    ) {
        if(!updateMaintainProgramTaskInput)
            return {
                errors: [
                    {
                        message: "Không có dữ liệu đầu vào!"
                    }
                ]
            }
        if (!updateMaintainProgramTaskInput.newDistanceThreshold && !updateMaintainProgramTaskInput.newTimeThreshold)
            return {
                errors: [
                    {
                        message: "Dữ liệu không hợp lệ!"
                    }
                ]
            }
        let updatedMaintainProgramTask = await em.findOne(MaintainProgramTask, {id: updateMaintainProgramTaskInput.id})
        if(!updatedMaintainProgramTask)
            return {
                errors: [
                    {
                        message: "Không tìm thấy MaintainProgramTask!"
                    }
                ]
            }
        if (updateMaintainProgramTaskInput.newDistanceThreshold)
            updatedMaintainProgramTask.distanceThreshold = updateMaintainProgramTaskInput.newDistanceThreshold;
        if (updateMaintainProgramTaskInput.newTimeThreshold)
            updatedMaintainProgramTask.timeThreshold = updateMaintainProgramTaskInput.newTimeThreshold;
        if (updateMaintainProgramTaskInput.newState)
            updatedMaintainProgramTask.done = updateMaintainProgramTaskInput.newState;
        let maintainProgramToken = await em.findOne(MaintainProgram, {id: updateMaintainProgramTaskInput.newMaintainProgramId});
        if (maintainProgramToken)
            updatedMaintainProgramTask.maintainProgram  = maintainProgramToken;
        let maintainTaskToken = await em.findOne(MaintainTask, {id: updateMaintainProgramTaskInput.newMaintainTaskId});
        if (maintainTaskToken)
            updatedMaintainProgramTask.maintainTask = maintainTaskToken;
        em.persist(updatedMaintainProgramTask);
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
            resullt: updatedMaintainProgramTask
        }
    }
    async deleteMaintainProgramTask(
        @Ctx() {em}:MyContext,
        @Arg("inputs", {nullable:true}) deleteMaintainProgramTaskInput?: deleteMaintainProgramTaskInput,
    ) {
        if(!deleteMaintainProgramTaskInput)
            return {
                errors: [
                    {
                        message: "Không có dữ liệu đầu vào!"
                    }
                ]
            }
        let deletedMaintainProgramTask = await em.findOne(MaintainProgramTask, {id:deleteMaintainProgramTaskInput.id})
		if (!deletedMaintainProgramTask)
            return {
                errors: [
                    {
                        message: "Không tìm thấy MaintainProgramTask!"
                    }
                ]
            }
        em.persist(deletedMaintainProgramTask);
        try{
            await em.removeAndFlush(deletedMaintainProgramTask);
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
            resullt: deletedMaintainProgramTask
        }
    }
}