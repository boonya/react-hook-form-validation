import create, { isValid } from './required';
import { createValidatorResult } from '../helpers';
import { VALIDATION_MESSAGES, VALIDATORS } from '../types';

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
			const result = isValid(value);

			expect(result).toBe(false);
			expect(createValidatorResult).toBeCalledWith(
				false,
				{ fail: VALIDATION_MESSAGES.required },
				[{ input: value }]
			);
		});
	});

	it('should reject and pass custom messages.', () => {
		const result = isValid('', { fail: 'Fail', success: 'Success' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: 'Fail', success: 'Success' },
			[{ input: '' }]
		);
	});
});

describe('Valid', () => {
	[
		0,
		'0',
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
			const result = isValid(value);

			expect(result).toBe(true);
			expect(createValidatorResult).toBeCalledWith(
				true,
				{ fail: VALIDATION_MESSAGES.required },
				[{ input: value }]
			);
		});
	});

	it('should accept and pass custom messages.', () => {
		const result = isValid('any', { fail: 'Fail', success: 'Success' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: 'Fail', success: 'Success' },
			[{ input: 'any' }],
		);
	});
});

describe('definition object creator', () => {
	const validator = VALIDATORS.required;

	it('should return basic validator definition object.', () => {
		const object = create();

		expect(object).toEqual({ validator });
	});

	it('should return extended validator definition object.', () => {
		const object = create({ fail: 'Fail', success: 'Success' });

		expect(object).toEqual({ validator, fail: 'Fail', success: 'Success' });
	});
});
