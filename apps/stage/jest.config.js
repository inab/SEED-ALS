/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: 'node',
	testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.js'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
	},
	transformIgnorePatterns: ['/node_modules/(?!(url-join)/)'],
};
