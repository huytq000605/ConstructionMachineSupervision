import { ELASTIC_SEARCH_HOST } from "@root/config";
import { createLogger, format, transports } from "winston";
import {
  ElasticsearchTransport,
  ElasticsearchTransportOptions,
} from "winston-elasticsearch";

const esTransportOpts: ElasticsearchTransportOptions = {
  level: "info",
  clientOpts: {
    node: ELASTIC_SEARCH_HOST,
  },
};

const esTransport = new ElasticsearchTransport(esTransportOpts);

export const logger = createLogger({
  format: format.errors({ stack: true }),
  exceptionHandlers: [
    new transports.File({
      filename: `${__dirname}/../logs/exceptions.log`,
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.printf((info) =>
          JSON.stringify({
            level: info.level,
            timestamp: info.timestamp,
            message: info.message,
          })
        )
      ),
    }),
    esTransport,
  ],
  exitOnError: false,
  transports: [
    new transports.File({
      level: "warn",
      filename: `${__dirname}/../logs/warns.log`,
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.printf((info) =>
          JSON.stringify({
            level: info.level,
            timestamp: info.timestamp,
            message: info.message,
          })
        )
      ),
    }),
    new transports.File({
      level: "error",
      filename: `${__dirname}/../logs/errors.log`,
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.printf((info) =>
          JSON.stringify({
            level: info.level,
            timestamp: info.timestamp,
            message: info.message,
          })
        )
      ),
    }),
    new transports.File({
      maxsize: 5120000,
      maxFiles: 5,
      filename: `${__dirname}/../logs/combined.log`,
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.ms(),
        format.printf((info) =>
          JSON.stringify({
            level: info.level,
            timestamp: info.timestamp,
            at: info.ms,
            message: info.message,
          })
        )
      ),
    }),
    new transports.Console({
      level: "debug",
      format: format.combine(
        format.colorize({
          all: true,
          colors: {
            info: "green",
            error: "red",
            warn: "yellow",
          },
        }),
        format.simple(),
        format.timestamp(),
        format.printf(({ timestamp, level, message, stack }) => {
          return `[${timestamp}] ${level}: ${stack || message}`;
        })
      ),
    }),
    esTransport,
  ],
});
