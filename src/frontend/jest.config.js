// jest.config.js
export default {
  preset: 'ts-jest',
  // Change testEnvironment to jsdom for React/DOM tests
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/test', '<rootDir>/src'], 
  testMatch: ['**/test/**/*.test.ts', '**/test/**/*.test.tsx', '**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowImportingTsExtensions: true,
        jsx: "react-jsx"
      },
    }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.ts$': '$1', // allowImportingTsExtensions support
  },
};