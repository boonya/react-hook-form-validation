import validateValue from './required';
import { createValidatorResult } from '../helpers';
import { VALIDATION_MESSAGES } from '../types';

jest.mock('../helpers');

beforeEach(() => {
	jest.mocked(createValidatorResult)
		.mockName('createValidatorResult')
		.mockImplementation((error) => error);
});

describe('Error', () => {
	[
		undefined,
		'',
		'   ',
		{},
		[],
		null,
	].forEach((value) => {
		const label = `${JSON.stringify(value)} (${typeof value})`;
		it(`should reject ${label}.`, () => {
			const result = validateValue(value);

			expect(result).toBe(true);
			expect(createValidatorResult).toBeCalledWith(
				true,
				{ fail: VALIDATION_MESSAGES.required },
				[{ input: value }]
			);
		});
	});

	it('should reject and pass custom messages.', () => {
		const result = validateValue('', { fail: 'Fail', success: 'Success' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: 'Fail', success: 'Success' },
			[{ input: '' }]
		);
	});
});

describe('Valid', () => {
	[
		0,
		23,
		23.23,
		-41,
		'valid',
		{ error: false },
		['valid'],
		[false],
		[null],
	].forEach((value) => {
		const label = `${JSON.stringify(value)} (${typeof value})`;
		it(`should accept ${label}.`, () => {
			const result = validateValue(value);

			expect(result).toBe(false);
			expect(createValidatorResult).toBeCalledWith(
				false,
				{ fail: VALIDATION_MESSAGES.required },
				[{ input: value }]
			);
		});
	});

	it('should accept and pass custom messages.', () => {
		const result = validateValue('any', { fail: 'Fail', success: 'Success' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: 'Fail', success: 'Success' },
			[{ input: 'any' }],
		);
	});
});
