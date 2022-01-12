import create, { isValid } from './maxLength';
import { createValidatorResult } from '../helpers';
import { VALIDATION_MESSAGES, VALIDATORS } from '../types';

jest.mock('../helpers');

beforeEach(() => {
	jest.mocked(createValidatorResult)
		.mockName('createValidatorResult')
		.mockImplementation((error) => error);
});

describe('Error', () => {
	it('should reject "🔎🧨🧪🚚" as a string of at most 3 characters is expected.', () => {
		const result = isValid('🔎🧨🧪🚚', { expected: 3 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.maxLength },
			[{ actual: 4, expected: 3 }],
		);
	});

	it('should reject Array(🔎, 🧨, 🧪, 🚚) as an array of at most 3 items is expected.', () => {
		const result = isValid(['🔎', '🧨', '🧪', '🚚'], { expected: 3 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.maxLength },
			[{ actual: 4, expected: 3 }],
		);
	});

	it('should reject and pass custom messages.', () => {
		const result = isValid('12345', { expected: 4, fail: 'Fail', success: 'Success' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: 'Fail', success: 'Success' },
			[{ actual: 5, expected: 4 }],
		);
	});

	it('should reject 10 as numbers are not supported.', () => {
		const result = isValid(10, { expected: 20 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.maxLength },
			[{ actual: undefined, expected: 20 }],
		);
	});
});

describe('Valid', () => {
	it('should accept "ABCD" as a string of at most 5 characters is expected.', () => {
		const result = isValid('ABCD', { expected: 5 });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.maxLength },
			[{ actual: 4, expected: 5 }],
		);
	});

	it('should accept "ABCDE" as a string of at most 5 characters is expected.', () => {
		const result = isValid('ABCDE', { expected: 5 });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.maxLength },
			[{ actual: 5, expected: 5 }],
		);
	});

	it('should accept Array(1, 2, 3, 4) as an array of at most 5 items is expected.', () => {
		const result = isValid([1, 2, 3, 4], { expected: 5 });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.maxLength },
			[{ actual: 4, expected: 5 }],
		);
	});

	it('should accept Array(1, 2, 3, 4, 5) as an array of at most 5 items is expected.', () => {
		const result = isValid([1, 2, 3, 4, 5], { expected: 5 });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.maxLength },
			[{ actual: 5, expected: 5 }],
		);
	});

	it('should accept and pass custom messages.', () => {
		const result = isValid('1234', { expected: 4, fail: 'Fail', success: 'Success' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: 'Fail', success: 'Success' },
			[{ actual: 4, expected: 4 }],
		);
	});
});

describe('validator definition object creator', () => {
	it('should return basic validator definition object.', () => {
		const expected = 5;
		const object = create(expected);

		expect(object).toEqual({ validator: VALIDATORS.maxLength, expected });
	});

	it('should return extended validator definition object.', () => {
		const expected = 5;
		const object = create(expected, { fail: 'Fail', success: 'Success' });

		expect(object).toEqual({ validator: VALIDATORS.maxLength, expected, fail: 'Fail', success: 'Success' });
	});
});
