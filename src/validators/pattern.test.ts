import validateValue from './pattern';
import { createValidatorResult } from '../helpers';
import { VALIDATION_MESSAGES } from '../types';

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
			const result = validateValue(value, { pattern });

			expect(result).toBe(true);
			expect(createValidatorResult).toBeCalledWith(
				true,
				{ fail: VALIDATION_MESSAGES.pattern },
				[{ input: value }],
			);
		});
	});

	it('should reject and pass custom messages.', () => {
		const input = '    ';
		const result = validateValue(input, { pattern, fail: 'Fail', success: 'Success' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
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
			const result = validateValue(value, { pattern });

			expect(result).toBe(false);
			expect(createValidatorResult).toBeCalledWith(
				false,
				{ fail: VALIDATION_MESSAGES.pattern },
				[{ input: value }],
			);
		});
	});

	it('should accept and pass custom messages.', () => {
		const input = '1stPassword';
		const result = validateValue(input, { pattern, fail: 'Fail', success: 'Success' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: 'Fail', success: 'Success' },
			[{ input }],
		);
	});
});
