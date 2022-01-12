import validateValue from './maxLength';
import { createValidatorResult } from '../helpers';
import { VALIDATION_MESSAGES } from '../types';

jest.mock('../helpers');

beforeEach(() => {
	jest.mocked(createValidatorResult)
		.mockName('createValidatorResult')
		.mockImplementation((error) => error);
});

describe('Error', () => {
	it('should reject "🔎🧨🧪🚚" as a string of at most 3 characters is expected.', () => {
		const result = validateValue('🔎🧨🧪🚚', { expected: 3 });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.maxLength },
			[{actual: 4, expected: 3}],
		);
	});

	it('should reject Array(🔎, 🧨, 🧪, 🚚) as an array of at most 3 characters is expected.', () => {
		const result = validateValue(['🔎', '🧨', '🧪', '🚚'], { expected: 3 });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.maxLength },
			[{actual: 4, expected: 3}],
		);
	});

	it('should reject and pass custom messages.', () => {
		const result = validateValue('12345', { expected: 4, fail: 'Fail', success: 'Success' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: 'Fail', success: 'Success' },
			[{actual: 5, expected: 4}],
		);
	});

	it('should reject 10 as numbers are not supported.', () => {
		const result = validateValue(10, { expected: 20 });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.maxLength },
			[{actual: undefined, expected: 20}],
		);
	});
});

describe('Valid', () => {
	it('should accept "ABCD" as a string of at most 5 characters is expected.', () => {
		const result = validateValue('ABCD', { expected: 5 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.maxLength },
			[{actual: 4, expected: 5}],
		);
	});

	it('should accept "ABCDE" as a string of at most 5 characters is expected.', () => {
		const result = validateValue('ABCDE', { expected: 5 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.maxLength },
			[{actual: 5, expected: 5}],
		);
	});

	it('should accept Array(1, 2, 3, 4) as an array of at most 5 items is expected.', () => {
		const result = validateValue([1, 2, 3, 4], { expected: 5 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.maxLength },
			[{actual: 4, expected: 5}],
		);
	});

	it('should accept Array(1, 2, 3, 4, 5) as an array of at most 5 items is expected.', () => {
		const result = validateValue([1, 2, 3, 4, 5], { expected: 5 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.maxLength },
			[{actual: 5, expected: 5}],
		);
	});

	it('should accept and pass custom messages.', () => {
		const result = validateValue('1234', { expected: 4, fail: 'Fail', success: 'Success' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: 'Fail', success: 'Success' },
			[{actual: 4, expected: 4}],
		);
	});
});
