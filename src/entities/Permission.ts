import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import { Base } from "./Base";
import { Account }  from "./Account";
import { Field, InputType, ObjectType } from "type-graphql";
import { Role } from "./Role";

@Entity()
@ObjectType()
@InputType('PermissionInput')
export class Permission extends Base {

  @Property({unique: true})
  @Field()
  name: string
  
  @ManyToMany(() => Role, role => role.permissions)
  @Field(() => [Role])
  roles = new Collection<Role>(this);

}