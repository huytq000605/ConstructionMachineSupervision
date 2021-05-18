import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import path from "path";
import { MyContext } from "./types";
import {
  Connection,
  EntityManager,
  IDatabaseDriver,
  MikroORM,
} from "@mikro-orm/core";
import { MIKRO_OPTIONS } from "./config";

const globPathNameToGraphQLResolverFiles = "resolvers/**/+([A-Za-z]).{ts,js}";

export const getMikrorm = () => MikroORM.init(MIKRO_OPTIONS);

export const createApolloServer = async (
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>
) => {
  return new ApolloServer({
    schema: await buildSchema({
      resolvers: [path.join(__dirname, globPathNameToGraphQLResolverFiles)],
      validate: false,

      emitSchemaFile: {
        path: __dirname + "/schema.gql",
        commentDescriptions: true,
        sortedSchema: false,
      },
    }),
    uploads: false,
    //@ts-ignore
    context: ({ req, res }): MyContext => ({ em, req, res }),
  });
};
