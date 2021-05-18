import { MikroORM } from "@mikro-orm/core";
import path from "path";
import { isProduction } from "./app";

const { DB_HOST = "localhost", DB_NAME, DB_PASSWORD, DB_USER } = process.env;

export const MIKRO_OPTIONS = {
  migrations: {
    path: path.join(__dirname, "../migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: ["**/entities/**/*.js"], // path to your JS entities (dist), relative to `baseDir`
  entitiesTs: ["**/entities/**/*.ts"], //path to your TS entities (source), relative to `baseDir`
  dbName: DB_NAME,
  host: DB_HOST,
  type: "postgresql",
  user: DB_USER,
  password: DB_PASSWORD,
  debug: !isProduction,
} as Parameters<typeof MikroORM.init>[0];

// For CLI
export default MIKRO_OPTIONS;
