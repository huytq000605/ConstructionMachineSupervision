/* eslint-disable @typescript-eslint/no-var-requires */
const tsPreset = require("ts-jest/jest-preset");

module.exports = {
  //   ...tsPreset,
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/config/tests.ts"],
  moduleDirectories: ["node_modules", "."],
  testPathIgnorePatterns: ["dist/", "build/"],
  moduleNameMapper: {
    "@root/(.*)": "<rootDir>/src/$1",
  },
};
