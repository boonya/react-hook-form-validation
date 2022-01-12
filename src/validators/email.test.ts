import validateValue from './email';
import { createValidatorResult } from '../helpers';
import { VALIDATION_MESSAGES } from '../types';

jest.mock('../helpers');

beforeEach(() => {
	jest.mocked(createValidatorResult)
		.mockName('createValidatorResult')
		.mockImplementation((error) => error);
});

describe('Error', () => {
	it('should reject a bunch of spaces.', () => {
		const result = validateValue('   ');

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.email },
			[{ input: '   ' }],
		);
	});

	it('should reject an invalid email.', () => {
		const result = validateValue('invalid');

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: VALIDATION_MESSAGES.email },
			[{ input: 'invalid' }],
		);
	});

	it('should reject and pass custom messages.', () => {
		const result = validateValue('invalid', { fail: 'Fail', success: 'Success' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: 'Fail', success: 'Success' },
			[{ input: 'invalid' }],
		);
	});
});

describe('Valid', () => {
	[
		undefined,
		'',
		'anyone@gmail.com',
	].forEach((value) => {
		it(`should accept "${value}".`, () => {
			const result = validateValue(value);

			expect(result).toBe(false);
			expect(createValidatorResult).toBeCalledWith(
				false,
				{ fail: VALIDATION_MESSAGES.email },
				[{ input: value }],
			);
		});
	});

	it('should accept and pass custom messages.', () => {
		const result = validateValue('anyone@gmail.com', { fail: 'Fail', success: 'Success' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: 'Fail', success: 'Success' },
			[{ input: 'anyone@gmail.com' }],
		);
	});
});
