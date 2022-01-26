import create, { isValid } from './url';
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
		'    ',
		'any value',
		'//www.example.com',
		'/www.example.com',
		// TODO: Decide why do this value fails here
		// '\\www.example.com',
	].forEach((value) => {
		it(`should reject "${value}".`, () => {
			const result = isValid(value);

			expect(result).toBe(false);
			expect(createValidatorResult).toBeCalledWith(
				false,
				{ fail: VALIDATION_MESSAGES.url },
				[{ input: value }],
			);
		});
	});

	it('should reject and pass custom messages.', () => {
		const result = isValid('invalid value', { fail: 'Fail', success: 'Success' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: 'Fail', success: 'Success' },
			[{ input: 'invalid value' }],
		);
	});
});

describe('Valid', () => {
	[
		undefined,
		'',
		'http://example.com',
		'http://www.example.com',
		'https://example.com',
		'https://www.example.com',
		'https://example.com/any/path/to/something?queryString=a-value',
		'https://example.com/#main-content',
		'ftp://user:pwd@example.com',
		'www.example.com',
		'example.com',
		'example.com/any/path/to/something',
	].forEach((value) => {
		it(`should accept "${value}".`, () => {
			const result = isValid(value);

			expect(result).toBe(true);
			expect(createValidatorResult).toBeCalledWith(
				true,
				{ fail: VALIDATION_MESSAGES.url },
				[{ input: value }],
			);
		});
	});

	it('should accept and pass custom messages.', () => {
		const result = isValid('example.com', { fail: 'Fail', success: 'Success' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: 'Fail', success: 'Success' },
			[{ input: 'example.com' }],
		);
	});
});

describe('definition object creator', () => {
	const validator = VALIDATORS.url;

	it('should return basic validator definition object.', () => {
		const object = create();

		expect(object).toEqual({ validator });
	});

	it('should return extended validator definition object.', () => {
		const object = create({ fail: 'Fail', success: 'Success' });

		expect(object).toEqual({ validator, fail: 'Fail', success: 'Success' });
	});
});
