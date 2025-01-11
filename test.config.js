module.exports = {
  testEnvironment: 'node', // Sets up the Node.js testing environment
  verbose: true, // Displays detailed test results
  testMatch: ['**/*.test.js'], // Matches all test files with `.test.js`
  collectCoverage: true, // Collects test coverage information
  coverageDirectory: 'coverage', // Saves coverage reports in the "coverage" directory
};
