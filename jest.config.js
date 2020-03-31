module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['src/spec.ts', 'dist/*'],
  collectCoverage: true,
  coverageReporters: ['html', 'text'],
  rootDir: 'src',
};
