module.exports = {
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '^.+\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js'],
  moduleNameMapper: {
    '^nimma/fallbacks$': '<rootDir>/node_modules/nimma/dist/cjs/fallbacks/index.js',
    '^nimma/legacy$': '<rootDir>/node_modules/nimma/dist/legacy/cjs/index.js',
  },
};
