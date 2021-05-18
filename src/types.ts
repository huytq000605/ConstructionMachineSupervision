import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response as ResponseExpress } from "express";
import {
  ClassType,
  Field,
  InputType,
  InterfaceType,
  ObjectType,
  registerEnumType,
} from "type-graphql";

// Support both authentication jwt and session base;
export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: { userId?: number }; user?: { userId: number } };
  res: ResponseExpress;
};

@ObjectType()
class Error {
  @Field({ nullable: true })
  field?: string;

  @Field()
  message: string;
}

@InterfaceType({
  description: "Thông tin phản hồi có trong kết quả trả về của của toàn bộ API",
})
abstract class IResponse {
  @Field(() => [Error], { nullable: true })
  errors?: Error[];

  @Field({ nullable: true })
  message?: string;
}
@InterfaceType({
  description:
    "Thông tin phản hồi có trong kết quả trả về của của toàn bộ API phân trang",
})
abstract class IPagination {
  @Field()
  total: number;

  @Field()
  perPage: number;

  @Field()
  numPage: number;
}

export function PaginatedResponse<T>(Data: ClassType<T>) {
  @ObjectType(`${Data.name}TableDataResponse`, {
    isAbstract: true,
    implements: IPagination,
  })
  abstract class PaginatedData extends IPagination {
    @Field(() => [Data])
    list_data: T[];
  }

  @ObjectType({ isAbstract: true, implements: IResponse })
  abstract class Response extends IResponse {
    @Field(() => PaginatedData, { nullable: true })
    result?: PaginatedData;
  }

  return Response;
}

export function Response<T>(Data: ClassType<T>) {
  @ObjectType({ isAbstract: true, implements: IResponse })
  abstract class ResponseClass<T> extends IResponse {
    @Field(() => Data, { nullable: true })
    result?: T;
  }
  return ResponseClass;
}

@InputType()
export class QueryOptions {
  @Field(() => [SortOption], { nullable: true })
  sort?: SortOption[];

  @Field(() => [FilterOption], { nullable: true })
  filter?: FilterOption[];

  @Field({ nullable: true })
  numPage?: number;

  @Field({ nullable: true })
  perPage?: number;
}

@InputType()
class FilterOption {
  @Field()
  field: string;

  @Field(() => Operation)
  operation: Operation;

  @Field()
  value: string;
}

@InputType()
class SortOption {
  @Field()
  field: string;

  @Field(() => Direction)
  direction: Direction;
}

enum Operation {
  CONTAINS = "contains",
  START = "start",
  END = "end",
}

enum Direction {
  ASC = "asc",
  DESC = "desc",
}

registerEnumType(Operation, {
  name: "FilterOperation", // this one is mandatory
  description: "Operation filter", // this one is optional
});

registerEnumType(Direction, {
  name: "SortDirection", // this one is mandatory
  description: "Sort Direction", // this one is optional
});
