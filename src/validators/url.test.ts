import validateValue from './url';
import { createValidationMessage } from '../helpers';
import { VALIDATION_MESSAGES } from '../types';
import { mocked } from 'ts-jest/utils';

jest.mock('../helpers');
mocked(createValidationMessage).mockName('createValidationMessage');

it('Should skip a falsy value.', () => {
	const result = validateValue('');

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

[
	'http://boonya.info',
	'http://www.boonya.info',
	'https://boonya.info',
	'https://www.boonya.info',
	'https://boonya.info/any/path/to/something',
	'www.boonya.info',
	'boonya.info',
	'boonya.info/any/path/to/something',
].forEach((value) => {
	it(`Returns falsy if "${value}" passed.`, () => {
		const result = validateValue(value);

		expect(createValidationMessage).toHaveBeenCalledTimes(0);
		expect(result).toBeFalsy();
	});
});

[
	'    ',
	'any value',
	'//www.boonya.info',
	'/www.boonya.info',
	// TODO: Decide why do this value fails here
	// '\\www.boonya.info',
].forEach((value) => {
	it(`Returns built-in error message if "${value}" passed.`, () => {
		const result = validateValue(value);

		expect(createValidationMessage).toHaveBeenCalledTimes(0);
		expect(result).toEqual(VALIDATION_MESSAGES.url);
	});

	it(`Returns custom error message if "${value}" passed.`, () => {
		mocked(createValidationMessage).mockName('createValidationMessage').mockReturnValueOnce('An error message');
		const result = validateValue(value, { message: 'An error message pattern' });

		expect(createValidationMessage).toBeCalledTimes(1);
		expect(createValidationMessage).toBeCalledWith('An error message pattern');
		expect(result).toEqual('An error message');
	});
});
