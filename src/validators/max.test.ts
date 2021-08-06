import validateValue from './max';
import { createValidationMessage } from '../helpers';
import { VALIDATION_MESSAGES } from '../types';
import { mocked } from 'ts-jest/utils';

jest.mock('../helpers');
mocked(createValidationMessage).mockName('createValidationMessage');

it('Returns falsy if passed a number less than a limit.', () => {
	const result = validateValue(0, { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns falsy if passed a number equal to limit.', () => {
	const result = validateValue(5, { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns built-in error message if passed a number greater than a limit.', () => {
	const result = validateValue(6, { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toEqual(VALIDATION_MESSAGES.max);
});

it('Returns custom error message if passed a number greater than a limit.', () => {
	mocked(createValidationMessage).mockName('createValidationMessage').mockReturnValueOnce('An error message');
	const result = validateValue(6, { expected: 5, message: 'An error message pattern' });

	expect(createValidationMessage).toBeCalledTimes(1);
	expect(createValidationMessage).toBeCalledWith('An error message pattern', { actual: 6, expected: 5 });
	expect(result).toEqual('An error message');
});

it('Returns falsy if passed a string shorter than a limit.', () => {
	const result = validateValue('A', { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns falsy if passed a string which length is equal to a limit.', () => {
	const result = validateValue('АБВГД', { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns built-in if passed a string longer than a limit.', () => {
	const result = validateValue('АБВГДЕ', { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toEqual(VALIDATION_MESSAGES.max);
});

it('Returns custom error message if passed a string longer than a limit.', () => {
	mocked(createValidationMessage).mockName('createValidationMessage').mockReturnValueOnce('An error message');
	const result = validateValue('АБВГДЕ', { expected: 5, message: 'An error message pattern' });

	expect(createValidationMessage).toBeCalledTimes(1);
	expect(createValidationMessage).toBeCalledWith('An error message pattern', { actual: 6, expected: 5 });
	expect(result).toEqual('An error message');
});

it('Returns falsy if passed an array smaller than a limit.', () => {
	const result = validateValue([1], { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns falsy if passed an array which length is equal to a limit.', () => {
	const result = validateValue([1, 2, 3, 4, 5], { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns built-in error message if passed an array longer than a limit.', () => {
	const result = validateValue([1, 2, 3, 4, 5, 6], { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toEqual(VALIDATION_MESSAGES.max);
});
it('Returns custom error message if passed an array longer than a limit.', () => {
	mocked(createValidationMessage).mockName('createValidationMessage').mockReturnValueOnce('An error message');

	const result = validateValue([1, 2, 3, 4, 5, 6], { expected: 5, message: 'An error message pattern' });

	expect(createValidationMessage).toBeCalledTimes(1);
	expect(createValidationMessage).toBeCalledWith('An error message pattern', { actual: 6, expected: 5 });
	expect(result).toEqual('An error message');
});
