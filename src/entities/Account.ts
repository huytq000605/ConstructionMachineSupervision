import { Cascade, Collection, Entity, ManyToMany, OneToOne, Property } from "@mikro-orm/core";
import { getImage } from "@root/utils/imageHandler";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";
import { Driver } from "./Driver";
import { Manager } from "./Manager";
import { Permission } from "./Permission";
import { Role } from "./Role";

@ObjectType()
@InputType("AccountInput")
@Entity()
export class Account extends Base {
    _avatar: string | null

    @Property({ unique: true })
    @Field()
    email: string;

    @Property({ nullable: true , type: "string"})
    @Field(() => String, { nullable: true })
    get avatar(): string | null {
        if(this._avatar) return getImage(this._avatar)
        else return null;
    }

    set avatar(value: string | null) {
        this._avatar = value;
    }
    @Property()
    @Field()
    password: string;

    @Property({ type: "boolean" })
    @Field()
    verify: boolean;

    @Property({ type: "date" })
    @Field(() => String)
    lastActive = new Date();

    @Property({ nullable: true, type: "boolean" })
    @Field({ nullable: true })
    root: boolean;

    @OneToOne(() => Driver, (driver) => driver.account, {
        nullable: true,
        cascade: [Cascade.ALL],
    })
    @Field(() => Driver, { nullable: true })
    driver: Driver;

    @OneToOne(() => Manager, (manager) => manager.account, {
        nullable: true,
        cascade: [Cascade.ALL],
    })
    @Field(() => Manager, { nullable: true })
    manager: Manager;

    @ManyToMany(() => Role, (role) => role.accounts, { owner: true })
    @Field(() => [Role])
    roles = new Collection<Role>(this);

    // @ManyToMany(() => Permission, (permission) => permission.accounts, {
    //     owner: true,
    // })
    // @Field(() => [Permission])
    // permissions = new Collection<Permission>(this);
}