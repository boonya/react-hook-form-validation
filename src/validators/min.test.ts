import create, { isValid } from './min';
import { createValidatorResult } from '../helpers';
import { VALIDATION_MESSAGES, VALIDATORS } from '../types';

jest.mock('../helpers');

beforeEach(() => {
	jest.mocked(createValidatorResult)
		.mockName('createValidatorResult')
		.mockImplementation((error) => error);
});

describe('number error', () => {
	it('should reject 4 because no less than 5 is expected.', () => {
		const result = isValid(4, { expected: 5, mode: 'number' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 4, expected: 5 }]
		);
	});

	it('should reject "10" because no less than 100 is expected.', () => {
		const result = isValid('10', { expected: 100, mode: 'number' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 10, expected: 100 }]
		);
	});

	it('should reject "0000000030" because no less than 41 is expected.', () => {
		const result = isValid('0000000030', { expected: 41, mode: 'number' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 30, expected: 41 }]
		);
	});

	it('should reject -1 because no less than 5 is expected.', () => {
		const result = isValid(-1, { expected: 5, mode: 'number' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: -1, expected: 5 }]
		);
	});

	it('should reject "-200" because no less than 5 is expected.', () => {
		const result = isValid('-200', { expected: 5, mode: 'number' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: -200, expected: 5 }]
		);
	});

	it('should reject "-10" and return custom error message.', () => {
		const result = isValid('-10', { expected: 5, mode: 'number', fail: 'Custom message' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: 'Custom message' },
			[{ actual: -10, expected: 5 }]
		);
	});

	it('should reject not a numeric value.', () => {
		const result = isValid('9hundreds', { expected: 5, mode: 'number' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: NaN, expected: 5 }]
		);
	});

	it('should reject "2e2" (200) because no less than 333 is expected.', () => {
		const result = isValid('2e2', { expected: 333, mode: 'number' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 200, expected: 333 }],
		);
	});
});

describe('number valid', () => {
	it('should accept 10 because no less than 5 is expected.', () => {
		const result = isValid(10, { expected: 5, mode: 'number' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 10, expected: 5 }],
		);
	});

	it('should accept 13 because no less than 13 is expected.', () => {
		const result = isValid(13, { expected: 13, mode: 'number' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 13, expected: 13 }],
		);
	});

	it('should accept 2e2 (200) because no less than 200 is expected.', () => {
		const result = isValid(2e2, { expected: 200, mode: 'number' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 200, expected: 200 }],
		);
	});

	it('should accept "2e2" (200) because no less than 200 is expected.', () => {
		const result = isValid('2e2', { expected: 200, mode: 'number' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 200, expected: 200 }],
		);
	});
});

describe('length error', () => {
	it('should reject "🔎🧨🧪🚚" as a string of at least 5 characters is expected.', () => {
		const result = isValid('🔎🧨🧪🚚', { expected: 5, mode: 'length' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 4, expected: 5 }],
		);
	});

	it('should reject Array(🔎, 🧨, 🧪, 🚚) as an array of at least 5 items is expected.', () => {
		const result = isValid(['🔎', '🧨', '🧪', '🚚'], { expected: 5, mode: 'length' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 4, expected: 5 }],
		);
	});

	it('should reject and pass custom messages.', () => {
		const result = isValid('10', { expected: 5, mode: 'length', fail: 'Fail', success: 'Success' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: 'Fail', success: 'Success' },
			[{ actual: 2, expected: 5 }],
		);
	});

	it('should reject 10 as numbers are not supported.', () => {
		const result = isValid(10, { expected: 5, mode: 'length' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: undefined, expected: 5 }],
		);
	});
});

describe('length valid', () => {
	it('should accept "ABCDEFG" as a string of at least 5 characters is expected.', () => {
		const result = isValid('ABCDEFG', { expected: 5, mode: 'length' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 7, expected: 5 }],
		);
	});

	it('should accept "ABCDE" as a string of at least 5 characters is expected.', () => {
		const result = isValid('ABCDE', { expected: 5, mode: 'length' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 5, expected: 5 }],
		);
	});

	it('should accept Array(1, 2, 3, 4, 5, 6) as an array of at least 5 items is expected.', () => {
		const result = isValid([1, 2, 3, 4, 5, 6], { expected: 5, mode: 'length' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 6, expected: 5 }],
		);
	});

	it('should accept Array(1, 2, 3, 4, 5) as an array of at least 5 items is expected.', () => {
		const result = isValid([1, 2, 3, 4, 5], { expected: 5, mode: 'length' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.min },
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

		expect(object).toEqual({ validator: VALIDATORS.min, expected, mode: 'number' });
	});

	it('should return extended validator definition object.', () => {
		const expected = 5;
		const object = create(expected, undefined, { fail: 'Fail', success: 'Success' });

		expect(object).toEqual({ validator: VALIDATORS.min, expected, mode: 'number', fail: 'Fail', success: 'Success' });
	});

	it('should return length validator definition object.', () => {
		const expected = 5;
		const object = create(expected, 'length');

		expect(object).toEqual({ validator: VALIDATORS.min, expected, mode: 'length' });
	});

	it('should return extended length validator definition object.', () => {
		const expected = 5;
		const object = create(expected, 'length', { fail: 'Fail', success: 'Success' });

		expect(object).toEqual({ validator: VALIDATORS.min, expected, mode: 'length', fail: 'Fail', success: 'Success' });
	});
});
