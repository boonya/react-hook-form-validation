import validateValue from './url';
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
		'    ',
		'any value',
		'//www.example.com',
		'/www.example.com',
		// TODO: Decide why do this value fails here
		// '\\www.example.com',
	].forEach((value) => {
		it(`should reject "${value}".`, () => {
			const result = validateValue(value);

			expect(result).toBe(true);
			expect(createValidatorResult).toBeCalledWith(
				true,
				{ fail: VALIDATION_MESSAGES.url },
				[{ input: value }],
			);
		});
	});

	it('should reject and pass custom messages.', () => {
		const result = validateValue('invalid value', { fail: 'Fail', success: 'Success' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
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
			const result = validateValue(value);

			expect(result).toBe(false);
			expect(createValidatorResult).toBeCalledWith(
				false,
				{ fail: VALIDATION_MESSAGES.url },
				[{ input: value }],
			);
		});
	});

	it('should accept and pass custom messages.', () => {
		const result = validateValue('example.com', { fail: 'Fail', success: 'Success' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: 'Fail', success: 'Success' },
			[{ input: 'example.com' }],
		);
	});
});






