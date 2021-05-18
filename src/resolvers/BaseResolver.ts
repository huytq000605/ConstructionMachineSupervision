import { PrimaryKey, Property } from "@mikro-orm/core";
import { MyContext } from "@root/types";
import { GraphQLResolveInfo } from "graphql";
import fieldsToRelations from "graphql-fields-to-relations";
import {
  Arg,
  ClassType,
  Ctx,
  Field,
  ID,
  Info,
  InterfaceType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

export function createBaseResolver<T extends ClassType>(
  suffix: string,
  objectTypeCls: T
) {
  @Resolver({ isAbstract: true })
  abstract class BaseResolver {
    @Query(() => [objectTypeCls], { name: `getAll${suffix}` })
    async getAll(
      @Ctx() { em }: MyContext,
      @Info() info: GraphQLResolveInfo
    ): Promise<T[]> {
      const relationPaths = fieldsToRelations(info);
      return em.find(objectTypeCls, {}, relationPaths);
    }

    @Query(() => objectTypeCls, { name: `get${suffix}ById` })
    async getById(
      @Arg("id", () => ID) id: any,
      @Ctx() { em }: MyContext,
      @Info() info: GraphQLResolveInfo
    ): Promise<T> {
      const relationPaths = fieldsToRelations(info);
      return em.findOneOrFail(objectTypeCls, { id }, relationPaths);
    }

    @Mutation(() => Boolean, { name: `delete${suffix}ById` })
    async deleteById(
      @Arg("id", () => ID) id: any,
      @Ctx() { em }: MyContext
    ): Promise<boolean> {
      await em.nativeDelete(objectTypeCls, { id });
      return true;
    }
    @Mutation(() => objectTypeCls, { name: `create${suffix}` })
    async create(
      @Arg("data", () => objectTypeCls) data: T,
      @Ctx() { em }: MyContext
    ): Promise<T> {
      const entity = em.create(objectTypeCls, data);
      await em.persistAndFlush(entity);
      return entity;
    }
  }

  return BaseResolver;
}

@InterfaceType({
  description: "Thông tin mà toàn bộ tài nguyên trong hệ thống đều có",
})
export abstract class IResource {
  @Field(() => ID)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();
}
