import validateValue from './func';
import { createValidationMessage } from '../helpers';
import { VALIDATION_MESSAGES } from '../types';
import { mocked } from 'ts-jest/utils';

jest.mock('../helpers');
mocked(createValidationMessage).mockName('createValidationMessage');

it('Returns falsy if custom function returns truthy.', () => {
	const func = jest.fn().mockName('func').mockReturnValueOnce(true);

	const result = validateValue('A value', { func });

	expect(func).toBeCalledTimes(1);
	expect(func).toBeCalledWith('A value');
	expect(createValidationMessage).toBeCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns built-in error message if custom function returns falsy.', () => {
	const func = jest.fn().mockName('func').mockReturnValueOnce(false);

	const result = validateValue('A value', { func });

	expect(func).toBeCalledTimes(1);
	expect(func).toBeCalledWith('A value');
	expect(createValidationMessage).toBeCalledTimes(0);
	expect(result).toBe(VALIDATION_MESSAGES.invalid);
});

it('Returns built-in error message if custom function throws an error.', () => {
	const func = jest.fn(() => {
		throw new Error('An error');
	}).mockName('func');

	expect(() => validateValue('A value', { func })).toThrowError(new Error('An error'));
});

it('Returns custom error message if custom function returns falsy.', () => {
	mocked(createValidationMessage).mockName('createValidationMessage').mockReturnValueOnce('An error message');

	const func = jest.fn().mockName('func').mockReturnValueOnce(false);

	const result = validateValue('A value', { func, message: 'An error message pattern' });

	expect(createValidationMessage).toBeCalledTimes(1);
	expect(createValidationMessage).toBeCalledWith('An error message pattern');
	expect(result).toEqual('An error message');
});
