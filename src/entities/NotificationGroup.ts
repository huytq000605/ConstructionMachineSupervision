import { Cascade, Collection, Entity, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { AccountNotificationGroup } from "./AccountNotificationGroup";
import { Base } from "./Base";
import { Notification } from "./Notification";

@ObjectType()
@Entity()
@InputType('NotificationGroupInput')
export class NotificationGroup extends Base {
    @Property()
    @Field()
    name: string;
    
    @Field({nullable: true})
    @Property({nullable: true})
    description?: string;
    
    @OneToMany(() => Notification, notification => notification.group)
    notifications = new Collection<Notification>(this);

    @OneToMany(() => AccountNotificationGroup, accountNotificationGroup => accountNotificationGroup.notificationGroup)
    accountNotificationGroup = new Collection<AccountNotificationGroup>(this);
}