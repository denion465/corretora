/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: 'src',
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    './corretora/service/*.ts',
    './api/*.ts'
  ],
  coverageDirectory: '../coverage'
};
