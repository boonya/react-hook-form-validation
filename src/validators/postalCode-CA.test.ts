import validateValue from './postalCode-CA';
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
	'A1C 3S4',
	'A1C3S4',
	'a1c 3s4',
	'V9A 7N2',
	'B3K 5X5',
	'K8N 5W6',
	'K1A 0B1',
	'B1Z 0B9',
].forEach((value) => {
	it(`Returns falsy if "${value}" passed.`, () => {
		const result = validateValue(value);

		expect(createValidationMessage).toHaveBeenCalledTimes(0);
		expect(result).toBeFalsy();
	});
});

[
	'        ',
	'any value',
	'a1a1a',
	'A1A  1A1',
	'K1A 0D1',
	'W1A 0B1',
	'Z1A 0B1',
].forEach((value) => {
	it(`Returns built-in error message if "${value}" passed.`, () => {
		const result = validateValue(value);

		expect(createValidationMessage).toHaveBeenCalledTimes(0);
		expect(result).toEqual(VALIDATION_MESSAGES.postalCodeCA);
	});

	it(`Returns custom error message if "${value}" passed.`, () => {
		mocked(createValidationMessage).mockName('createValidationMessage').mockReturnValueOnce('An error message');
		const result = validateValue(value, { message: 'An error message pattern' });

		expect(createValidationMessage).toBeCalledTimes(1);
		expect(createValidationMessage).toBeCalledWith('An error message pattern');
		expect(result).toEqual('An error message');
	});
});
