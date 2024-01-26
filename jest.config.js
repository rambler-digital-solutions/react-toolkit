/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['./src'],
  moduleDirectories: ['packages', 'node_modules'],
  collectCoverage: true,
  coverageReporters: ['text'],
  transformIgnorePatterns: [`node_modules/(?!${['superjson'].join('|')})`],
  transform: {
    '^.+\\.jsx?$': ['ts-jest', {useESM: true}]
  }
}
