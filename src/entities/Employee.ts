import {
	Cascade,
	Collection,
	Entity,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	Property,
} from "@mikro-orm/core";
import { District, Province, Village } from "@root/resolvers/Hanhchinh";
import { Field, InputType, ObjectType } from "type-graphql";
import { Account } from "./Account";
import { Base } from "./Base";
import { Driver } from "./Driver";
import { Issue } from "./Issue";
import { Manager } from "./Manager";
@InputType("PlaceInput")
@ObjectType() 
export class Place {
    @Field()
    province: string;

    @Field()
    district: string;
    
    @Field()
    village: string;
}
@ObjectType()
@Entity()
@InputType("EmployeeInput")
export class Employee extends Base {
    @Field()
    @Property()
    name: string;

    @Field({ nullable: true })
    @Property({ nullable: true })
    phone?: string;

    @Field({ nullable: true })
    @Property({columnType: "jsonb", nullable: true })
    address?: string;

    @Field({ nullable: true })
    @Property({ nullable: true })
    dateOfBirth?: string; // validate dd-mm-yyyy or dd/mm/yyyy

    @Field({nullable: true})
    @Property({ nullable: true })
    salary?: number;

    @Field({nullable: true})
    @Property({ nullable: true })
    unit?: string;

    @Field(() => String, { nullable: true })
    @Property({ type: "date", nullable: true })
    startWork?: Date;

    @Field(() => String, { nullable: true })
    @Property({ type: "date", nullable: true })
    endWork?: Date;

    @Field(() => Driver, { nullable: true })
    @OneToOne(() => Driver, (driver) => driver.employee, { nullable: true })
    driver: Driver;

    @Field(() => Manager, { nullable: true })
    @OneToOne(() => Manager, (manager) => manager.employee, { nullable: true })
    manager: Manager;

    @Field(() => Issue, { nullable: true })
    @ManyToMany(() => Issue, (issue) => issue.assignees, { nullable: true })
    issues: Issue;
}
