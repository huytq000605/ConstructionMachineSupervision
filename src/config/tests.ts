/**
 * This file will run before each test file
 * Use in @setupFilesAfterEnv - Jest
 */
/**
 * @jest-environment <rootDir>/src/config/mongo-test-environment
 */

import { Db } from "mongodb";

jest.mock("winston", () => ({
  format: {
    colorize: jest.fn(),
    combine: jest.fn(),
    label: jest.fn(),
    timestamp: jest.fn(),
    printf: jest.fn(),
    json: jest.fn(),
    ms: jest.fn(),
    simple: jest.fn(),
  },
  createLogger: jest.fn().mockReturnValue({
    debug: jest.fn(),
    log: jest.fn(),
    info: jest.fn(),
    error: jest.fn(),
  }),
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
}));
