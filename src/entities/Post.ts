import { Entity, Property } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";
import { Base } from "./Base";

@ObjectType()
@Entity()
@InputType('PostInput')
export class Post extends Base {
  @Field()
  @Property({ type: "text" })
  title!: string;
}
