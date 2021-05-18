import { ClientOpts } from "redis";

const {
  REDIS_PORT = "6379",
  REDIS_HOST = "localhost",
  REDIS_PASSWORD,
} = process.env;

export const REDIS_OPTIONS: ClientOpts = {
  port: +REDIS_PORT,
  host: REDIS_HOST,
  password: REDIS_PASSWORD,
};
