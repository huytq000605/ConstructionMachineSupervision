import {
	Arg,
	Field,
	ObjectType,
	Query,
	Resolver,
} from "type-graphql";
import { PaginatedResponse } from "@root/types";
@ObjectType()
export class Province{
    @Field()
    name: string
    @Field()
    type: string
    @Field()
    slug:string
    @Field()
    nameWithType:string
    @Field()
    code:string
}
@ObjectType()
export class District{
    @Field()
    name: string
    @Field()
    type: string
    @Field()
    slug: string
    @Field()
    nameWithType: string
    @Field()
    path: string
    @Field()
    pathWithType: string
    @Field()
    code: string
    @Field()
    parentCode: string
}
@ObjectType()
export class Village{
    @Field()
    name: string
    @Field()
    type: string
    @Field()
    slug: string
    @Field()
    nameWithType: string
    @Field()
    path: string
    @Field()
    pathWithType: string
    @Field()
    code: string
    @Field()
    parentCode: string
}

@ObjectType()
//@ts-ignore
class ProvincesTableResponse extends PaginatedResponse(Province) {}
@ObjectType()
//@ts-ignore
class DistrictsTableResponse extends PaginatedResponse(District) {}
@ObjectType()
//@ts-ignore
class VillagesTableResponse extends PaginatedResponse(Village) {}

const province = require('axios').default;
const district = require('axios').default;
const village = require('axios').default;
@Resolver()
export class ProvinceDistrictVillage{
    @Query(() => ProvincesTableResponse)
    async getProvinces() {
        const provincesData = (await province.get('https://raw.githubusercontent.com/CANHBK/hanhchinhvn/master/dist/tinh_tp.json')).data;
        let provincesList: Province[] = [];
        let total= 0;
        for (let provinceCode in provincesData)
            {
                provincesList.push(provincesData[provinceCode]);
                provincesList[provincesList.length - 1].nameWithType = provincesData[provinceCode].name_with_type;
                ++total;
            }
        return {
            result: {
				total: total,
                list_data: provincesList
			}
        }
    }
    @Query(() => DistrictsTableResponse)
    async getDistrictsByProvince(
        @Arg("inputs", { nullable:true }) provinceCode?: string
    ) {
        const districtsData = (await district.get('https://raw.githubusercontent.com/CANHBK/hanhchinhvn/master/dist/quan_huyen.json')).data;
        let districtsList: District[] = [];
        let total = 0;
        for(let districtCode in districtsData)
            if (districtsData[districtCode].parent_code == provinceCode){
                ++total;
                districtsList.push(districtsData[districtCode]);
                districtsList[districtsList.length - 1].nameWithType = districtsData[districtCode].name_with_type;
                districtsList[districtsList.length - 1].pathWithType = districtsData[districtCode].path_with_type;
                districtsList[districtsList.length - 1].parentCode = districtsData[districtCode].parent_code;
            }
        return {
            result: {
				total: total,
                list_data: districtsList
			}
        }
    } 
    @Query(() => VillagesTableResponse)
    async getVillagesByDistrict(
        @Arg("inputs", { nullable: true }) districtCode?: string
    ) {
        const villagesData = (await village.get('https://raw.githubusercontent.com/CANHBK/hanhchinhvn/master/dist/xa_phuong.json')).data;
        let villagesList: Village[] = [];
        let total = 0;
        for(let villageCode in villagesData)
            if (villagesData[villageCode].parent_code == districtCode){
                ++total;
                villagesList.push(villagesData[villageCode]);
                villagesList[villagesList.length - 1].nameWithType = villagesData[villageCode].name_with_type;
                villagesList[villagesList.length - 1].pathWithType = villagesData[villageCode].path_with_type;
                villagesList[villagesList.length - 1].parentCode = villagesData[villageCode].parent_code;
            }
        return {
            result: {
				total: total,
                list_data: villagesList
			}
        }
    }
}
