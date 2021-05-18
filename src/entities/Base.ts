import { PrimaryKey, Property } from "@mikro-orm/core";
import { IResource } from "@root/resolvers/BaseResolver";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType({isAbstract: true})
export class Base implements IResource {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
