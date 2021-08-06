module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['src'],
	coverageDirectory: 'coverage',
	coverageReporters: ['text-summary', 'html'],
	resetMocks: true,
	globals: {
		'ts-jest': {
			isolatedModules: true,
		},
	},
};
