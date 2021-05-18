import { Cascade, Collection, Entity, OneToMany, OneToOne, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Account } from "./Account";
import { Base } from "./Base";
import { Decision } from "./Decision";
import { Employee } from "./Employee";
import { ManagerProject } from "./ManagerProject";
import { ProjectDriver } from "./ProjectDriver";
import { ProjectVehicle } from "./ProjectVehicle";

@ObjectType()
@Entity()
@InputType("ManagerInput")
export class Manager extends Base {
    @OneToOne(() => Employee, (employee) => employee.manager, { owner: true })
    @Field(() => Employee)
    employee: Employee;

    @OneToOne(() => Account, (account) => account.manager, {
        nullable: true,
        owner: true,
        cascade: [Cascade.ALL],
    })
    @Field(() => Account, { nullable: true })
    account: Account;

    @OneToMany(() => ProjectDriver, (projectDriver) => projectDriver.manager, {
        cascade: [Cascade.ALL],
    })
    @Field(() => [ProjectDriver])
    projectDrivers = new Collection<ProjectDriver>(this);

    @OneToMany(
        () => ManagerProject,
        (managerProject) => managerProject.manager,
        { cascade: [Cascade.ALL] }
    )
    @Field(() => [ManagerProject])
    managerProjects = new Collection<ManagerProject>(this);

    @OneToMany(
        () => ProjectVehicle,
        (projectVehicle) => projectVehicle.manager,
        { cascade: [Cascade.ALL] }
    )
    @Field(() => [ProjectDriver])
    projectVehicles = new Collection<ProjectVehicle>(this);

    @OneToMany(() => Decision, (decision) => decision.manager)
    @Field(() => [Decision])
    decisions = new Collection<Decision>(this);
}