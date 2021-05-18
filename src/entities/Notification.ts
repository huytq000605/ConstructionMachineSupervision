import { Cascade, Collection, Entity, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { AccountNotificationMethod } from "./AccountNotificationMethod";
import { Base } from "./Base";
import { NotificationGroup } from "./NotificationGroup";

@ObjectType()
@Entity()
@InputType("NotificationInput")
export class Notification extends Base {
    @Property()
    @Field()
    name: string;

    @Field({ nullable: true })
    @Property({ nullable: true })
    description?: string;

    @ManyToOne(() => NotificationGroup, { nullable: true })
    @Field(() => NotificationGroup, {nullable: true})
    group?: NotificationGroup;

    @OneToMany(() => AccountNotificationMethod, accountNotificationMethod => accountNotificationMethod.notification)
    @Field(() => [AccountNotificationMethod])
    accountNotificationMethod = new Collection<AccountNotificationMethod>(this);
}