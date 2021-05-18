import { Cascade, Collection, Entity, OneToMany, OneToOne, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { Account }  from "./Account";
import { Report } from "./Report";
import { ProjectDriver } from "./ProjectDriver";
import { MobilizationSession } from "./MobilizationSession";
import { RefillHistory } from "./RefillHistory";
import { MaintainHistory } from "./MaintainHistory";
import { Field, InputType, ObjectType } from "type-graphql";
import { Employee } from "./Employee";

@ObjectType()
@InputType("DriverInput")
@Entity()
export class Driver extends Base {
    @Field({nullable: true})
    @Property({nullable: true})
    licenseNumber?: string;

    @Field({nullable: true})
    @Property({nullable: true})
    licenseClass?: string;

    @Field({nullable: true})
    @Property({nullable: true})
    licenseWhere?: string;

    @OneToOne(() => Employee, (employee) => employee.driver, { owner: true })
    @Field(() => Employee)
    employee: Employee;

    @OneToOne(() => Account, (account) => account.driver, {
        nullable: true,
        owner: true,
        cascade: [Cascade.ALL],
    })
    @Field(() => Account, { nullable: true })
    account: Account;

    @OneToMany(() => Report, (report) => report.driver, {
        cascade: [Cascade.ALL],
    })
    @Field(() => [Report])
    reports = new Collection<Report>(this);

    @OneToMany(() => ProjectDriver, (projectDriver) => projectDriver.driver, {
        cascade: [Cascade.ALL],
    })
    @Field(() => [ProjectDriver])
    projectDrivers = new Collection<ProjectDriver>(this);

    @OneToMany(() => RefillHistory, (refillHistory) => refillHistory.driver, {
        cascade: [Cascade.ALL],
    })
    @Field(() => [RefillHistory])
    refillHistories = new Collection<RefillHistory>(this);

    @OneToMany(
        () => MaintainHistory,
        (maintainHistory) => maintainHistory.driver,
        { cascade: [Cascade.ALL] }
    )
    @Field(() => [MaintainHistory])
    maintainHistories = new Collection<MaintainHistory>(this);

    @OneToMany(
        () => MobilizationSession,
        (mobilizationSession) => mobilizationSession.driver,
        { cascade: [Cascade.ALL] }
    )
    @Field(() => [MobilizationSession])
    mobilizationSessions = new Collection<MobilizationSession>(this);
}