import { Cascade, Collection, Entity, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Account } from "./Account";
import { Base } from "./Base";
import { NotificationMethod } from "./NotificationMethod";
import { Notification } from "./Notification"

@ObjectType()
@Entity()
@InputType("AccountNotificationMethodInput")
export class AccountNotificationMethod extends Base {
    @Property()
    @Field()
    enable: boolean;

    @Field(() => Account)
    @ManyToOne(() => Account)
    account: Account;

    @Field(() => NotificationMethod)
    @ManyToOne(() => NotificationMethod)
    notificationMethod: NotificationMethod;

    @Field(() => Notification)
    @ManyToOne(() => Notification)
    notification: Notification;
}