import { QueryOrder } from "@mikro-orm/core";
import { QueryOptions } from "@root/types";

const queryBuilder = (options?: QueryOptions) => {
  let filterBy = {},
    sortBy: { [key: string]: QueryOrder } = { id: QueryOrder.ASC };
  if (!options) {
    return {
      filterBy,
      sortBy,
      perPage: 20,
      numPage: 1,
    };
  }
  const { sort, filter, numPage = 1, perPage = 20 } = options;
  if (sort && sort.length > 0) {
    sortBy = sort.reduce((result: Record<string, QueryOrder>, current) => {
      result[current.field] = QueryOrder[current.direction];
      return result;
    }, {});
  }
  if (filter && filter.length > 0) {
    filterBy = filter.reduce(
      (result: { $and: Array<Record<string, any>> }, current) => {
        const regex = buildRegexObject(current.value, current.operation);
        result.$and.push({
          [current.field]: regex,
        });
        return result;
      },
      { $and: [] }
    );
  }
  return {
    sortBy,
    filterBy,
    numPage,
    perPage,
  };
};

const buildRegexObject = (str = "", operation = "contains") => {
  // TO DO: For special case in RegExp constructor
  // Replace all special char like / \ - ...
  switch (operation) {
    case "contains":
      return { $re: new RegExp(str, "g") };
    case "start":
      return { $re: new RegExp(`^${str}`) };
    case "end":
      return { $re: new RegExp(`${str}$`) };
    default:
      throw new Error("Wrong operator");
  }
};

export default queryBuilder;
