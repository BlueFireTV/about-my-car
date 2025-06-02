// jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test', '<rootDir>/src'], 
  testMatch: ['**/test/**/*.test.ts', '**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.ts$': '$1', // allowImportingTsExtensions support
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        esModuleInterop: true,
        allowImportingTsExtensions: true,
      },
    },
  },
};