import validateValue from './async';
import { createValidationMessage } from '../helpers';
import { VALIDATION_MESSAGES } from '../types';
import { mocked } from 'ts-jest/utils';

jest.mock('../helpers');
mocked(createValidationMessage).mockName('createValidationMessage');

it('Returns falsy if custom function resolve truthy.', async () => {
	const func = jest.fn().mockName('func').mockResolvedValue(true);

	const result = await validateValue('A value', { func });

	expect(func).toBeCalledTimes(1);
	expect(func).toBeCalledWith('A value');
	expect(createValidationMessage).toBeCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns built-in error message if custom function resolve falsy.', async () => {
	const func = jest.fn().mockName('func').mockResolvedValue(false);

	const result = await validateValue('A value', { func });

	expect(func).toBeCalledTimes(1);
	expect(func).toBeCalledWith('A value');
	expect(createValidationMessage).toBeCalledTimes(0);
	expect(result).toBe(VALIDATION_MESSAGES.invalid);
});

it('Returns built-in error message if custom function rejected.', async () => {
	const func = jest.fn().mockName('func').mockRejectedValue(new Error('An error'));

	await expect(validateValue('A value', { func })).rejects.toThrowError(new Error('An error'));
});

it('Returns custom error message if custom function resolve falsy.', async () => {
	mocked(createValidationMessage).mockName('createValidationMessage').mockReturnValueOnce('An error message');

	const func = jest.fn().mockName('func').mockResolvedValue(false);

	const result = await validateValue('A value', { func, message: 'An error message pattern' });

	expect(createValidationMessage).toBeCalledTimes(1);
	expect(createValidationMessage).toBeCalledWith('An error message pattern');
	expect(result).toEqual('An error message');
});
