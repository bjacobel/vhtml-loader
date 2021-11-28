module.exports = {
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: '<rootDir>/reports/coverage',
  moduleDirectories: ['<rootDir>/node_modules'],
  moduleFileExtensions: ['ts', 'js', 'json', 'jsx'],
  snapshotSerializers: ['jest-serializer-html-string'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  testRunner: 'jest-jasmine2',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
};
