import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { Account }  from "./Account";
import { Field, InputType, ObjectType } from "type-graphql";
import { Permission } from "./Permission";

@Entity()
@ObjectType()
@InputType('RoleInput')
export class Role extends Base {

  @Property({unique: true})
  @Field()
  name: string
  
  @ManyToMany(() => Account, account => account.roles)
  @Field(() => [Account])
  accounts = new Collection<Account>(this);

  @ManyToMany(() => Permission, permission => permission.roles, { owner: true })
  @Field(() => [Permission])
  permissions = new Collection<Permission>(this);  
}