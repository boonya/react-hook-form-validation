import validateValue from './pattern';
import { createValidationMessage, createValidatorResult } from '../helpers';
import { VALIDATION_MESSAGES } from '../types';
import { mocked } from 'ts-jest/utils';

jest.mock('../helpers');

beforeEach(() => {
	mocked(createValidationMessage).mockName('createValidationMessage')
		.mockImplementation((message) => message);
	mocked(createValidatorResult).mockName('createValidatorResult')
		.mockImplementation((error) => ({ error, message: 'message' }));
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
	].forEach((value) => {
		it(`"${value}"`, () => {
			const result = validateValue(value, { pattern });

			expect(createValidationMessage).toBeCalledTimes(0);
			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(true, { fail: VALIDATION_MESSAGES.pattern });
			expect(result).toEqual({ error: true, message: 'message' });
		});
	});

	it('Custom message', () => {
		const result = validateValue('    ', { pattern, fail: 'Custom error' });

		expect(createValidationMessage).toBeCalledTimes(1);
		expect(createValidationMessage).toBeCalledWith('Custom error');
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(true, { fail: 'Custom error' });
		expect(result).toEqual({ error: true, message: 'message' });
	});
});

describe('Valid', () => {
	it('undefined', () => {
		const result = validateValue(undefined, { pattern });

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(false, { fail: undefined });
		expect(result).toEqual({ error: false, message: 'message' });
	});

	it('empty string', () => {
		const result = validateValue('', { pattern });

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(false, { fail: undefined });
		expect(result).toEqual({ error: false, message: 'message' });
	});

	[
		'1stPassword',
		'2ndPassword',
		'3rd-Password',
	].forEach((value) => {
		it(`"${value}"`, () => {
			const result = validateValue(value, { pattern });

			expect(createValidationMessage).toBeCalledTimes(0);
			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(false, { fail: undefined });
			expect(result).toEqual({ error: false, message: 'message' });
		});
	});
});
