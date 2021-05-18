import { Entity, Property } from "@mikro-orm/core";
import { IResource } from "@root/resolvers/BaseResolver";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";

@ObjectType({ implements: IResource })
@Entity()
@InputType("UserInput")
export class User extends Base {
  @Field()
  @Property({ unique: true })
  email!: string;

  @Property()
  @Field()
  password!: string;
}
