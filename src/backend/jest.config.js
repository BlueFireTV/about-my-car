// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // (Optional) Falls du Tests nur in bestimmten Ordnern suchst:
  // roots: ['<rootDir>/test'],
  // Falls deine Tests .ts‐Dateien im Unterordner test/cars haben:
  // testMatch: ['**/test/**/*.test.ts'],

  // (Optional) Sollte dein TypeScript‐Code Module-Aliases verwenden (z.B. "paths" in tsconfig),
  // musst du "moduleNameMapper" entsprechend anpassen. 
  // Beispiel:
  // moduleNameMapper: {
  //   '^@src/(.*)$': '<rootDir>/src/$1',
  // },

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json', // Pfad zu deiner tsconfig.json
    },
  },
  // Damit .ts und .tsx als Testdateien erkannt werden:
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};