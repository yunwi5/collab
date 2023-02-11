process.env['TESTING'] = 'true';
process.env['NODE_ENV'] = 'development';

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFilesAfterEnv: ['jest-extended/all'],
  testRegex: '.e2e-spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleDirectories: ['<rootDir>/../', 'node_modules'],
};
