import {Label} from "@root/entities/Label"
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
class LabelResponse extends Response(Label) {}

//@ts-ignore
@ObjectType()
//@ts-ignore
class LabelTableResponse extends PaginatedResponse(Label) {}

@InputType()
class createLabelInput{
	@Field()
	name!: string
}
@InputType()
class updateLabelInput{
	@Field()
	id!: number

	@Field({nullable:true})
	name: string
}
@InputType()
class deleteLabelInput{
	@Field()
	id!: number
}
@Resolver()
export class LabelResolver{
	@Query(()=>LabelResponse)
	async getLabelById(
		@Ctx() {em} :MyContext,
		@Arg("intput", {nullable:true}) labelId?: number
	) {
		const label = await em.find(Label, {id: labelId});
		if (!label)
			return {
				errors: [
					{
						message : "Không tìm thấy Label!"
					}
				]
			}
		else 
			return {
				result: label
			}
	}
	
	@Query(()=>LabelTableResponse)
	async getLabelByIssueId(
		@Ctx() {em} : MyContext,
		@Arg("inputs",{nullable:true}) issueId: number
	) {
		const list_data = await em.find(Label, {issues: {id:issueId}});
		let perPage = 1;
		let numPage = 20;
		let total = await em.count(Label, {issues: {id:issueId}});
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total
			}
		}
	}
	@Query(()=>LabelTableResponse)
    async getLabelTable(
        @Ctx() {em} : MyContext,
        @Arg("inputs", {nullable: true}) options: QueryOptions
    ) {
		const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
        const list_data = await em.find(Label, filterBy, {
            limit: perPage,
			offset: perPage * (numPage - 1),
			orderBy: sortBy,
        });
        const total = await em.count(Label, filterBy);
		return {
			result: {
				perPage,
				numPage,
				list_data,
				total
			}
		}
    }
	@Mutation(()=>LabelResponse)
	async createLabel(
		@Ctx() {em}:MyContext,
		@Arg("inputs") inputs: createLabelInput
	) {
		const data = await em.findOne(Label, { name: inputs.name });
		if (data) {
			return {
				errors: [
					{
						message: "Đã có label cùng tên trong database!"
					}
				]
			}
		}
		let token = await em.findOne(Label, {name: inputs.name});
		if (token)
			return {
				errors: [
					{
						message: "Đã tồn tại Label này!"
					}
				]
			}

		let label = em.create(Label, inputs);
		em.persist(label);
		try {
			await em.flush();
		} catch (error) {
			return {
				errors: [
					{
						message: "error",
					},
				],
			};
		}

		return {
			result: label,
		};
	}
	@Mutation(()=>LabelResponse)
	async updateLabel(
		@Ctx() {em}: MyContext,
		@Arg("inputs") inputs: updateLabelInput 
	) {
		let label = await em.findOne(Label, {id: inputs.id});
		if (!label)
			return {
				errors: [
					{
						message: "Không tồn tại Label này!"
					}
				]
			}
		if (inputs.name)
			label.name = inputs.name;
		em.persist(label);
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
			result: label,
		};
	}
	@Mutation(()=>LabelResponse)
	async deleteLabel(
		@Ctx() {em} :MyContext,
		@Arg("inputs") inputs: deleteLabelInput
	){
		let deletedLabel = await em.findOne(Label, {id: inputs.id})
		if(!deletedLabel)
			return {
				errors: [
					{
						message: "Không tồn tại Label này!"
					}
				]
			}
		em.persist(deletedLabel);
		try{
			em.remove(Label).flush();
		} catch(error) {
			return {
				errors: [
					{
						message: error,
					},
				],
			};
		}
		return {
			message: "Xoá Label thành công",
		};
	}
}
