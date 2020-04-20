module.exports = {
	verbose: true,
	testEnvironment: 'node',
	coverageDirectory: './coverage',
	collectCoverage: true,
	coverageReporters: [
		'lcov',
		'text',
		'text-summary'
	],
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100
		}
	}
};
