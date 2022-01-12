import create, { isValid } from './max';
import { createValidatorResult } from '../helpers';
import { VALIDATION_MESSAGES, VALIDATORS } from '../types';

jest.mock('../helpers');

beforeEach(() => {
	jest.mocked(createValidatorResult)
		.mockName('createValidatorResult')
		.mockImplementation((error) => error);
});

describe('Error', () => {
	it('should reject 6 because no greater than 5 is expected.', () => {
		const result = isValid(6, { expected: 5 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 6, expected: 5 }],
		);
	});

	it('should reject "131" because no greater than 130 is expected.', () => {
		const result = isValid('131', { expected: 130 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 131, expected: 130 }],
		);
	});

	it('should reject "000032" because no greater than 11 is expected.', () => {
		const result = isValid('000032', { expected: 11 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 32, expected: 11 }],
		);
	});

	it('should reject 1 because no greater than -3 is expected.', () => {
		const result = isValid(1, { expected: -3 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 1, expected: -3 }],
		);
	});

	it('should reject "3" because no greater than 1 is expected.', () => {
		const result = isValid('3', { expected: 1 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 3, expected: 1 }],
		);
	});

	it('should reject "5" and return custom error message.', () => {
		const result = isValid('5', { expected: -10, fail: 'Custom message' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: 'Custom message' },
			[{ actual: 5, expected: -10 }],
		);
	});

	it('should reject not a numeric value.', () => {
		const result = isValid('9hundreds', { expected: 5 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: NaN, expected: 5 }],
		);
	});

	it('should reject "2e2" (200) because no greater than 199 is expected.', () => {
		const result = isValid('2e2', { expected: 199 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 200, expected: 199 }],
		);
	});
});

describe('Valid', () => {
	it('should accept 6 because no greater than 10 is expected.', () => {
		const result = isValid(6, { expected: 10 });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 6, expected: 10 }],
		);
	});

	it('should accept 13 because no greater than 13 is expected.', () => {
		const result = isValid(13, { expected: 13 });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 13, expected: 13 }],
		);
	});

	it('should accept 2e2 (200) because no greater than 200 is expected.', () => {
		const result = isValid(2e2, { expected: 200 });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 200, expected: 200 }],
		);
	});

	it('should accept "2e2" (200) because no greater than 200 is expected.', () => {
		const result = isValid('2e2', { expected: 201 });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.max },
			[{ actual: 200, expected: 201 }],
		);
	});
});

describe('validator definition object creator', () => {
	it('should return basic validator definition object.', () => {
		const expected = 5;
		const object = create(expected);

		expect(object).toEqual({ validator: VALIDATORS.max, expected });
	});

	it('should return extended validator definition object.', () => {
		const expected = 5;
		const object = create(expected, { fail: 'Fail', success: 'Success' });

		expect(object).toEqual({ validator: VALIDATORS.max, expected, fail: 'Fail', success: 'Success' });
	});
});
