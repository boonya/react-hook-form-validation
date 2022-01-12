import create, { isValid } from './min';
import { createValidatorResult } from '../helpers';
import { VALIDATION_MESSAGES, VALIDATORS } from '../types';

jest.mock('../helpers');

beforeEach(() => {
	jest.mocked(createValidatorResult)
		.mockName('createValidatorResult')
		.mockImplementation((error) => error);
});

describe('Error', () => {
	it('should reject 4 because no less than 5 is expected.', () => {
		const result = isValid(4, { expected: 5 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 4, expected: 5 }]
		);
	});

	it('should reject "10" because no less than 100 is expected.', () => {
		const result = isValid('10', { expected: 100 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 10, expected: 100 }]
		);
	});

	it('should reject "0000000030" because no less than 41 is expected.', () => {
		const result = isValid('0000000030', { expected: 41 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 30, expected: 41 }]
		);
	});

	it('should reject -1 because no less than 5 is expected.', () => {
		const result = isValid(-1, { expected: 5 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: -1, expected: 5 }]
		);
	});

	it('should reject "-200" because no less than 5 is expected.', () => {
		const result = isValid('-200', { expected: 5 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: -200, expected: 5 }]
		);
	});

	it('should reject "-10" and return custom error message.', () => {
		const result = isValid('-10', { expected: 5, fail: 'Custom message' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: 'Custom message' },
			[{ actual: -10, expected: 5 }]
		);
	});

	it('should reject not a numeric value.', () => {
		const result = isValid('9hundreds', { expected: 5 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: NaN, expected: 5 }]
		);
	});

	it('should reject "2e2" (200) because no less than 333 is expected.', () => {
		const result = isValid('2e2', { expected: 333 });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 200, expected: 333 }],
		);
	});
});

describe('Valid', () => {
	it('should accept 10 because no less than 5 is expected.', () => {
		const result = isValid(10, { expected: 5 });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 10, expected: 5 }],
		);
	});

	it('should accept 13 because no less than 13 is expected.', () => {
		const result = isValid(13, { expected: 13 });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 13, expected: 13 }],
		);
	});

	it('should accept 2e2 (200) because no less than 200 is expected.', () => {
		const result = isValid(2e2, { expected: 200 });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 200, expected: 200 }],
		);
	});

	it('should accept "2e2" (200) because no less than 200 is expected.', () => {
		const result = isValid('2e2', { expected: 200 });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.min },
			[{ actual: 200, expected: 200 }],
		);
	});
});

describe('validator definition object creator', () => {
	it('should return basic validator definition object.', () => {
		const expected = 5;
		const object = create(expected);

		expect(object).toEqual({ validator: VALIDATORS.min, expected });
	});

	it('should return extended validator definition object.', () => {
		const expected = 5;
		const object = create(expected, { fail: 'Fail', success: 'Success' });

		expect(object).toEqual({ validator: VALIDATORS.min, expected, fail: 'Fail', success: 'Success' });
	});
});
