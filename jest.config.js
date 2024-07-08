/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  // Automatically clear mock calls, instances, contexts, and results before every test
  clearMocks: true,

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ["json", "text", "lcov", "clover"],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/tests/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],

  // A list of paths to modules that run some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Indicates whether each individual test should be reported during the run
  verbose: true,
};

export default config;
