import validateValue from './pattern';
import { createValidationMessage } from '../helpers';
import { VALIDATION_MESSAGES } from '../types';
import { mocked } from 'ts-jest/utils';

jest.mock('../helpers');
mocked(createValidationMessage).mockName('createValidationMessage');

/**
 * Checks that a password has a minimum of 6 characters,
 * at least 1 uppercase letter,
 * 1 lowercase letter,
 * and 1 number with no spaces.
 * Source: https://regex101.com/library/fX8dY0
 */
const pattern = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/u;

it('Should skip a falsy value.', () => {
	const result = validateValue('', { pattern });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

[
	'1stPassword',
	'2ndPassword',
	'3rd-Password',
].forEach((value) => {
	it(`Returns falsy if "${value}" passed.`, () => {
		const result = validateValue(value, { pattern });

		expect(createValidationMessage).toHaveBeenCalledTimes(0);
		expect(result).toBeFalsy();
	});
});

[
	'        ',
	'any value',
	'3rd Password',
	'3rd-password',
	'Pass1',
	'12345678',
].forEach((value) => {
	it(`Returns built-in error message if "${value}" passed.`, () => {
		const result = validateValue(value, { pattern });

		expect(createValidationMessage).toHaveBeenCalledTimes(0);
		expect(result).toEqual(VALIDATION_MESSAGES.pattern);
	});

	it(`Returns custom error message if "${value}" passed.`, () => {
		mocked(createValidationMessage).mockName('createValidationMessage').mockReturnValueOnce('An error message');
		const result = validateValue(value, { pattern, message: 'An error message pattern' });

		expect(createValidationMessage).toBeCalledTimes(1);
		expect(createValidationMessage).toBeCalledWith('An error message pattern');
		expect(result).toEqual('An error message');
	});
});
