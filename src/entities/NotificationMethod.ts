import { Cascade, Collection, Entity, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { AccountNotificationMethod } from "./AccountNotificationMethod";
import { Base } from "./Base";
import { Notification } from "./Notification";

@ObjectType()
@Entity()
@InputType('NotificationMethodInput')
export class NotificationMethod extends Base {
    @Property()
    @Field()
    name: string;

    @OneToMany(() => AccountNotificationMethod, accountNotificationMethod => accountNotificationMethod.notificationMethod)
    @Field(() => [AccountNotificationMethod])
    accountNotificationMethod = new Collection<AccountNotificationMethod>(this);
}