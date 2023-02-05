process.env['TESTING'] = 'true';
process.env['NODE_ENV'] = 'development';

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  modulePaths: ['<rootDir>'],
  setupFilesAfterEnv: ['jest-extended/all'],
  verbose: true,
  testTimeout: 30000,
  testRegex: 'spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};
