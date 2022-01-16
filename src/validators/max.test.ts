import create, { isValid } from './max';
import { createValidatorResult } from '../helpers';
import { VALIDATION_MESSAGES, VALIDATORS } from '../types';

jest.mock('../helpers');

beforeEach(() => {
	jest.mocked(createValidatorResult)
		.mockName('createValidatorResult')
		.mockImplementation((error) => error);
});

describe('number error', () => {
	it('should reject 6 because no greater than 5 is expected.', () => {
		const result = isValid(6, { expected: 5, mode: 'number' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 6, expected: 5 }],
		);
	});

	it('should reject "131" because no greater than 130 is expected.', () => {
		const result = isValid('131', { expected: 130, mode: 'number' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 131, expected: 130 }],
		);
	});

	it('should reject "000032" because no greater than 11 is expected.', () => {
		const result = isValid('000032', { expected: 11, mode: 'number' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 32, expected: 11 }],
		);
	});

	it('should reject 1 because no greater than -3 is expected.', () => {
		const result = isValid(1, { expected: -3, mode: 'number' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 1, expected: -3 }],
		);
	});

	it('should reject "3" because no greater than 1 is expected.', () => {
		const result = isValid('3', { expected: 1, mode: 'number' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 3, expected: 1 }],
		);
	});

	it('should reject "5" and return custom error message.', () => {
		const result = isValid('5', { expected: -10, mode: 'number', fail: 'Custom message' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: 'Custom message' },
			[{ actual: 5, expected: -10 }],
		);
	});

	it('should reject not a numeric value.', () => {
		const result = isValid('9hundreds', { expected: 5, mode: 'number' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: NaN, expected: 5 }],
		);
	});

	it('should reject "2e2" (200) because no greater than 199 is expected.', () => {
		const result = isValid('2e2', { expected: 199, mode: 'number' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 200, expected: 199 }],
		);
	});
});

describe('number valid', () => {
	it('should accept 6 because no greater than 10 is expected.', () => {
		const result = isValid(6, { expected: 10, mode: 'number' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 6, expected: 10 }],
		);
	});

	it('should accept 13 because no greater than 13 is expected.', () => {
		const result = isValid(13, { expected: 13, mode: 'number' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 13, expected: 13 }],
		);
	});

	it('should accept 2e2 (200) because no greater than 200 is expected.', () => {
		const result = isValid(2e2, { expected: 200, mode: 'number' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 200, expected: 200 }],
		);
	});

	it('should accept "2e2" (200) because no greater than 200 is expected.', () => {
		const result = isValid('2e2', { expected: 201, mode: 'number' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 200, expected: 201 }],
		);
	});
});

describe('length error', () => {
	it('should reject "🔎🧨🧪🚚" as a string of at most 3 characters is expected.', () => {
		const result = isValid('🔎🧨🧪🚚', { expected: 3, mode: 'length' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 4, expected: 3 }],
		);
	});

	it('should reject Array(🔎, 🧨, 🧪, 🚚) as an array of at most 3 items is expected.', () => {
		const result = isValid(['🔎', '🧨', '🧪', '🚚'], { expected: 3, mode: 'length' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 4, expected: 3 }],
		);
	});

	it('should reject and pass custom messages.', () => {
		const result = isValid('12345', { expected: 4, mode: 'length', fail: 'Fail', success: 'Success' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: 'Fail', success: 'Success' },
			[{ actual: 5, expected: 4 }],
		);
	});

	it('should reject 10 as numbers are not supported.', () => {
		const result = isValid(10, { expected: 20, mode: 'length' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: undefined, expected: 20 }],
		);
	});
});

describe('length valid', () => {
	it('should accept "ABCD" as a string of at most 5 characters is expected.', () => {
		const result = isValid('ABCD', { expected: 5, mode: 'length' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 4, expected: 5 }],
		);
	});

	it('should accept "ABCDE" as a string of at most 5 characters is expected.', () => {
		const result = isValid('ABCDE', { expected: 5, mode: 'length' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 5, expected: 5 }],
		);
	});

	it('should accept Array(1, 2, 3, 4) as an array of at most 5 items is expected.', () => {
		const result = isValid([1, 2, 3, 4], { expected: 5, mode: 'length' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 4, expected: 5 }],
		);
	});

	it('should accept Array(1, 2, 3, 4, 5) as an array of at most 5 items is expected.', () => {
		const result = isValid([1, 2, 3, 4, 5], { expected: 5, mode: 'length' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 5, expected: 5 }],
		);
	});

	it('should accept and pass custom messages.', () => {
		const result = isValid('1234', { expected: 4, mode: 'length', fail: 'Fail', success: 'Success' });

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

		expect(object).toEqual({ validator: VALIDATORS.max, expected, mode: 'number' });
	});

	it('should return extended validator definition object.', () => {
		const expected = 5;
		const object = create(expected, undefined, { fail: 'Fail', success: 'Success' });

		expect(object).toEqual({ validator: VALIDATORS.max, expected, mode: 'number', fail: 'Fail', success: 'Success' });
	});

	it('should return length validator definition object.', () => {
		const expected = 5;
		const object = create(expected, 'length');

		expect(object).toEqual({ validator: VALIDATORS.max, expected, mode: 'length' });
	});

	it('should return extended length validator definition object.', () => {
		const expected = 5;
		const object = create(expected, 'length', { fail: 'Fail', success: 'Success' });

		expect(object).toEqual({ validator: VALIDATORS.max, expected, mode: 'length', fail: 'Fail', success: 'Success' });
	});
});
