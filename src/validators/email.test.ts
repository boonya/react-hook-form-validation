import create, {isValid} from './email';
import { createValidatorResult } from '../helpers';
import { VALIDATION_MESSAGES, VALIDATORS } from '../types';

jest.mock('../helpers');

beforeEach(() => {
	jest.mocked(createValidatorResult)
		.mockName('createValidatorResult')
		.mockImplementation((error) => error);
});

describe('Error', () => {
	it('should reject a bunch of spaces.', () => {
		const result = isValid('   ');

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.email },
			[{ input: '   ' }],
		);
	});

	it('should reject an invalid email.', () => {
		const result = isValid('invalid');

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
			{ fail: VALIDATION_MESSAGES.email },
			[{ input: 'invalid' }],
		);
	});

	it('should reject and pass custom messages.', () => {
		const result = isValid('invalid', { fail: 'Fail', success: 'Success' });

		expect(result).toBe(false);
		expect(createValidatorResult).toBeCalledWith(
			false,
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
			const result = isValid(value);

			expect(result).toBe(true);
			expect(createValidatorResult).toBeCalledWith(
				true,
				{ fail: VALIDATION_MESSAGES.email },
				[{ input: value }],
			);
		});
	});

	it('should accept and pass custom messages.', () => {
		const result = isValid('anyone@gmail.com', { fail: 'Fail', success: 'Success' });

		expect(result).toBe(true);
		expect(createValidatorResult).toBeCalledWith(
			true,
			{ fail: 'Fail', success: 'Success' },
			[{ input: 'anyone@gmail.com' }],
		);
	});
});

describe('validator definition object creator', () => {
	it('should return basic validator definition object.', () => {
		const object = create();

		expect(object).toEqual({validator: VALIDATORS.email});
	});

	it('should return extended validator definition object.', () => {
		const object = create({fail: 'Fail', success: 'Success'});

		expect(object).toEqual({validator: VALIDATORS.email, fail: 'Fail', success: 'Success'});
	});
});
