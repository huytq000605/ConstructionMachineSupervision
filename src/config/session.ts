import { SessionOptions } from "express-session";
import { isProduction } from "./app";

const HALF_HOURS = 1000 * 60 * 30;

export const {
  SESSION_SECRET = "SESSION_SECRET",
  SESSION_NAME = "qid",
  SESSION_IDLE_TIMEOUT = HALF_HOURS,
} = process.env;

export const SESSION_OPTIONS: SessionOptions = {
  name: SESSION_NAME,
  secret: SESSION_SECRET,
  resave: false,
  cookie: {
    maxAge: +SESSION_IDLE_TIMEOUT,
    httpOnly: true,
    // TODO: config nginx to use sameSite = "lax"
    sameSite: "none",
    secure: isProduction,
  },
  saveUninitialized: true,
};
