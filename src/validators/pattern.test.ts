import create, { isValid } from './pattern';
import { createValidatorResult } from '../helpers';
import { VALIDATION_MESSAGES, VALIDATORS } from '../types';

jest.mock('../helpers');

beforeEach(() => {
	jest.mocked(createValidatorResult)
		.mockName('createValidatorResult')
		.mockImplementation((error) => error);
});

/**
 * Checks that a password has a minimum of 6 characters,
 * at least 1 uppercase letter,
 * 1 lowercase letter,
 * and 1 number with no spaces.
 * Source: https://regex101.com/library/fX8dY0
 */
const pattern = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/u;

describe('Error', () => {
	[
		'        ',
		'any value',
		'3rd Password',
		'3rd-password',
		'Pass1',
		'12345678',
		false,
		true,
		NaN,
		0,
		1,
	].forEach((value) => {
		it(`should reject "${value}".`, () => {
			const result = isValid(value, { pattern });

			expect(result).toBe(false);
			expect(createValidatorResult).toBeCalledWith(
				false,
				{ fail: VALIDATION_MESSAGES.pattern },
				[{ input: value }],
			);
		});
	});

	it('should reject and pass custom messages.', () => {
		const input = '    ';
		const result = isValid(input, { pattern, fail: 'Fail', success: 'Success' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: 'Fail', success: 'Success' },
			[{ input }],
		);
	});
});

describe('Valid', () => {
	[
		undefined,
		'',
		'1stPassword',
		'2ndPassword',
		'3rd-Password',
	].forEach((value) => {
		it(`should accept "${value}".`, () => {
			const result = isValid(value, { pattern });

			expect(result).toBe(true);
			expect(createValidatorResult).toBeCalledWith(
				true,
				{ fail: VALIDATION_MESSAGES.pattern },
				[{ input: value }],
			);
		});
	});

	it('should accept and pass custom messages.', () => {
		const input = '1stPassword';
		const result = isValid(input, { pattern, fail: 'Fail', success: 'Success' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: 'Fail', success: 'Success' },
			[{ input }],
		);
	});
});

describe('definition object creator', () => {
	const validator = VALIDATORS.pattern;
	const pattern = /[abc]/ui;

	it('should return basic validator definition object.', () => {
		const object = create(pattern);

		expect(object).toEqual({ validator, pattern });
	});

	it('should return extended validator definition object.', () => {
		const object = create(pattern, { fail: 'Fail', success: 'Success' });

		expect(object).toEqual({ validator, pattern, fail: 'Fail', success: 'Success' });
	});
});
