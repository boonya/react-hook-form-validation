module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['src', 'tests'],
	coverageDirectory: 'coverage',
	coverageReporters: ['text-summary', 'html', 'lcov'],
	resetMocks: true,
	globals: {
		'ts-jest': {
			isolatedModules: true,
		},
	},
	'testPathIgnorePatterns' : [
		'<rootDir>/tests'
	]
};
