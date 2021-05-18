import { InspectionForm } from "@root/entities/InspectionForm";
import { InspectionFormItem } from "@root/entities/InspectionFormItem";
import { InspectionItem } from "@root/entities/InspectionItem";
import { MyContext, QueryOptions, Response, PaginatedResponse } from "@root/types";
import queryBuilder from "@root/utils/queryBuilder";
import { Arg, Ctx, Field, InputType, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";

//@ts-ignore
@ObjectType()
//@ts-ignore
class InspectionFormResponse extends Response(InspectionForm){}

@ObjectType()
class InspectionTableResponse extends PaginatedResponse(InspectionForm){}


@InputType()
class ChoicesInput {
    @Field()
    choices: string

    @Field()
    failIfChecked: boolean
}

@InputType()
class InspectionItemInputForm {
    @Field()
    inspectionItemId: number;

    @Field()
    remarkForPass: boolean;

    @Field()
    remarkForFail: boolean;

    @Field(() => [ChoicesInput], {nullable: true})
    choices: ChoicesInput[]

    @Field({nullable: true})
    rangeStart: number;
    
    @Field({nullable: true})
    rangeEnd: number;

    @Field({nullable: true})
    isPass: boolean;

    @Field({nullable: true})
    date: Date
}

@InputType()
class InspectionFormCreateInput {
    @Field()
    name: string
    
    @Field(() => [InspectionItemInputForm])
    inspectionItems: InspectionItemInputForm[]
}

@InputType()
class InspectionFormUpdateInput {
    @Field()
    inspectionFormId: number
    
    @Field(() => [InspectionItemInputForm])
    inspectionItems: InspectionItemInputForm[]
}


@Resolver()
export class InspectionResolver {
    @Query(() => InspectionTableResponse)
    async getInspectionForms(
        @Arg("inputs", { nullable: true }) options: QueryOptions,
        @Ctx() { em, req }: MyContext
    ) {
        const { sortBy, filterBy, numPage, perPage } = queryBuilder(options);
        (filterBy as any).$and.push({createdBy: { $in: [req.user?.userId, 0] }})
        const inspectionForms = await em.find(InspectionForm, filterBy, {
            orderBy: sortBy,
            skip: perPage * (numPage - 1),
            limit: perPage,
        });
        return {
            result: inspectionForms,
        };
    }

    @Query(() => InspectionFormResponse)
    async getInspectionForm(
        @Arg("inputs") id: number,
        @Ctx() {em} : MyContext
    ) {
        const inspectionForm = await em.findOne(InspectionForm, {id});
        if(!inspectionForm) return {
            errors: [
                {
                    message: "Không tồn tại inspectionForm này",
                    field: "id"
                }
            ]
        }
        return {
            result: inspectionForm
        }
    }

    @Mutation(() => InspectionFormResponse)
    async createInspectionForm(
        @Arg("inputs") inputs: InspectionFormCreateInput,
        @Ctx() { em, req }: MyContext
    ) {
        const inspectionForm = new InspectionForm();
        inspectionForm.createdBy = req.user!.userId;
        em.persist(inspectionForm);

        for (let inspectionItemInput of inputs.inspectionItems) {
            let inspectionFormItem = new InspectionFormItem();
            let inspectionItem = await em.findOne(InspectionItem, {
                id: inspectionItemInput.inspectionItemId,
            });
            if (!inspectionItem)
                return {
                    errors: {
                        message: "Không tồn tại item này",
                    },
                };
            inspectionFormItem.inspectionItem = inspectionItem;
            switch (inspectionItem.type) {
                case "choices":
                    inspectionFormItem.choices = JSON.stringify(
                        inspectionItemInput.choices
                    );
                    break;
                case "passOrFail":
                    inspectionFormItem.isPass = inspectionItemInput.isPass;
                    break;
                case "dateTime":
                    inspectionFormItem.date = inspectionItemInput.date;
                    break;
                case "rangeTime":
                    inspectionFormItem.rangeStart =
                        inspectionItemInput.rangeStart;
                    inspectionFormItem.rangeEnd = inspectionItemInput.rangeEnd;
                    break;
            }
            inspectionFormItem.remarkForFail = inspectionItemInput.remarkForFail
            inspectionFormItem.remarkForPass = inspectionItemInput.remarkForPass
            inspectionFormItem.inspectionForm = inspectionForm;
            em.persist(inspectionFormItem);
        }
        try {
            await em.flush();
        } catch (error) {
            return {
                errors: [
                    {
                        message: `Đã có lỗi xảy ra trong quá trình lưu dữ liệu
                        Error: ${error}`,
                    },
                ],
            };
        }
        return {
            result: inspectionForm,
            message: "Tạo form thành công",
        };
    }

    @Mutation(() => InspectionFormResponse)
    async updateInspectionForm(
        @Arg("inputs") inputs: InspectionFormUpdateInput,
        @Ctx() { em }: MyContext
    ) {
        const inspectionForm = await em.findOne(InspectionForm, { id: inputs.inspectionFormId });
        if(!inspectionForm) return {
            errors: [
                {
                    message: "Không tồn tại form này",
                    field: "id"
                }
            ]
        }

        for( let inspectionFormItem of inspectionForm.inspectionFormItem) {
            em.remove(inspectionFormItem);
        }

        for (let inspectionItemInput of inputs.inspectionItems) {
            let inspectionFormItem = new InspectionFormItem();
            let inspectionItem = await em.findOne(InspectionItem, {
                id: inspectionItemInput.inspectionItemId,
            });
            if (!inspectionItem)
                return {
                    errors: {
                        message: "Không tồn tại item này",
                    },
                };
            inspectionFormItem.inspectionItem = inspectionItem;
            switch (inspectionItem.type) {
                case "choices":
                    inspectionFormItem.choices = JSON.stringify(
                        inspectionItemInput.choices
                    );
                    break;
                case "passOrFail":
                    inspectionFormItem.isPass = inspectionItemInput.isPass;
                    break;
                case "dateTime":
                    inspectionFormItem.date = inspectionItemInput.date;
                    break;
                case "rangeTime":
                    inspectionFormItem.rangeStart =
                        inspectionItemInput.rangeStart;
                    inspectionFormItem.rangeEnd = inspectionItemInput.rangeEnd;
                    break;
            }
            inspectionFormItem.remarkForFail = inspectionItemInput.remarkForFail
            inspectionFormItem.remarkForPass = inspectionItemInput.remarkForPass
            inspectionFormItem.inspectionForm = inspectionForm;
            em.persist(inspectionFormItem);
        }
        try {
            await em.flush();
        } catch (error) {
            return {
                errors: [
                    {
                        message: `Đã có lỗi xảy ra trong quá trình update form
                        Error: ${error}`,
                    },
                ],
            };
        }
        return {
            result: inspectionForm,
            message: "Cập nhật form thành công",
        };
    }

    @Mutation(() => InspectionFormResponse)
    async deleteInspectionForm(
        @Arg("inputs") id: number,
        @Ctx() { em, req}: MyContext
    ) {
        const inspectionForm = await em.findOne(InspectionForm, {id});
        if(!inspectionForm) return {
            errors: [
                {
                    message: "Không tồn tại inspectionform này",
                    field: "id"
                }
            ]
        }
        await em.remove(inspectionForm).flush();

        return {
            message: "Xóa inspectionForm thành công"
        }
    }
}