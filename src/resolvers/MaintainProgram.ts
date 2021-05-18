import {MaintainProgram} from "@root/entities/MaintainProgram"
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
class MaintainProgramResponse extends Response(MaintainProgram) {}

//@ts-ignore
@ObjectType()
//@ts-ignore
class MaintainProgramTableResponse extends PaginatedResponse(MaintainProgram) {}

@InputType()
class createMaintainProgramInput{
    @Field()
    name: string
    @Field()
    description: string
}
@InputType()
class updateMaintainProgramInput{
    @Field()
    id: number
    @Field({nullable:true})
    newName: string
    @Field({nullable:true})
    newDescription: string
}
@InputType()
class deleteMaintainProgramInput{
    @Field({nullable:true})
    id: number
}

@Resolver()
export class MaintainProgramResolver{
    @Query(()=>MaintainProgramTableResponse)
	async getMaintainProgramByName(
		@Ctx() {em} : MyContext,
		@Arg("inputs",{nullable:true}) maintainProgramName: string
	) {
		const list_data = await em.find(MaintainProgram, {name: maintainProgramName});
		let perPage = 1;
		let numPage = 20;
		let total = await em.count(MaintainProgram, {name: maintainProgramName});
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total
			}
		}
	}
    @Query(()=>MaintainProgramTableResponse)
    async getMaintainProgramTable(
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
        const list_data = await em.find(MaintainProgram, filterBy, {
            limit: perPage,
			offset: perPage * (numPage - 1),
			orderBy: sortBy,
        });
        const total = await em.count(MaintainProgram, filterBy);
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total
			}
		}
    }
    @Mutation(()=>MaintainProgramResponse)
    async createMaintainProgram(
        @Ctx() {em} :MyContext,
        @Arg("inputs",{nullable:true}) createMaintainProgramInput?:createMaintainProgramInput
    ) {
        if (!createMaintainProgramInput)
            return {
                errors: [
                    {
                        message: "Không có dữ liệu đầu vào!"
                    }
                ]
            }
        let newMaintainProgram = em.create(MaintainProgram, createMaintainProgramInput);
        em.persist(newMaintainProgram);
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
            resullt: newMaintainProgram
        }
    }
    async updateMaintainProgram(
        @Ctx() {em}:MyContext,
        @Arg("inputs", {nullable:true}) updateMaintainProgramInput?: updateMaintainProgramInput,
    ) {
        if(!updateMaintainProgramInput)
            return {
                errors: [
                    {
                        message: "Không có dữ liệu đầu vào!"
                    }
                ]
            }
        let updatedMaintainProgram = await em.findOne(MaintainProgram, {id: updateMaintainProgramInput.id})
        if(!updatedMaintainProgram)
            return {
                errors: [
                    {
                        message: "Không tìm thấy MaintainProgram!"
                    }
                ]
            }
        if (updateMaintainProgramInput.newName)
            updatedMaintainProgram.name = updateMaintainProgramInput.newName;
        if (updateMaintainProgramInput.newDescription)
            updatedMaintainProgram.description = updateMaintainProgramInput.newDescription;
        em.persist(updatedMaintainProgram);
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
            resullt: updatedMaintainProgram
        }
    }
    async deleteMaintainProgram(
        @Ctx() {em}:MyContext,
        @Arg("inputs", {nullable:true}) deleteMaintainProgramInput?: deleteMaintainProgramInput,
    ) {
        if(!deleteMaintainProgramInput)
            return {
                errors: [
                    {
                        message: "Không có dữ liệu đầu vào!"
                    }
                ]
            }
        let deletedMaintainProgram = await em.findOne(MaintainProgram, {id:deleteMaintainProgramInput.id})
		if (!deletedMaintainProgram)
            return {
                errors: [
                    {
                        message: "Không tìm thấy MaintainProgram!"
                    }
                ]
            }
        em.persist(deletedMaintainProgram);
        try{
            await em.removeAndFlush(deletedMaintainProgram);
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
            resullt: deletedMaintainProgram
        }
    }
}