import validateValue from './minLength';
import { createValidationMessage } from '../helpers';
import { VALIDATION_MESSAGES } from '../types';
import { mocked } from 'ts-jest/utils';

jest.mock('../helpers');
mocked(createValidationMessage).mockName('createValidationMessage');

it('Returns falsy if passed a number greater than a limit.', () => {
	const result = validateValue(10, { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns falsy if passed a number equal to limit.', () => {
	const result = validateValue(5, { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns built-in error message if passed a number less than a limit.', () => {
	const result = validateValue(4, { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toEqual(VALIDATION_MESSAGES.minLength);
});

it('Returns custom error message if passed a number less than a limit.', () => {
	mocked(createValidationMessage).mockName('createValidationMessage').mockReturnValueOnce('An error message');

	const result = validateValue(4, { expected: 5, message: 'An error message pattern' });

	expect(createValidationMessage).toBeCalledTimes(1);
	expect(createValidationMessage).toBeCalledWith('An error message pattern', { expected: 5, actual: 4 });
	expect(result).toEqual('An error message');
});

it('Returns falsy if passed a string longer than a limit.', () => {
	const result = validateValue('AБВГДУЁЖЗ', { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns falsy if passed a string which length is equal to a limit.', () => {
	const result = validateValue('АБВГД', { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns built-in if passed a string shorter than a limit.', () => {
	const result = validateValue('АБВГ', { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toEqual(VALIDATION_MESSAGES.minLength);
});

it('Returns custom error message if passed a string shorter than a limit.', () => {
	mocked(createValidationMessage).mockName('createValidationMessage').mockReturnValueOnce('An error message');
	const result = validateValue('АБВГ', { expected: 5, message: 'An error message pattern' });

	expect(createValidationMessage).toBeCalledTimes(1);
	expect(createValidationMessage).toBeCalledWith('An error message pattern', { expected: 5, actual: 4 });
	expect(result).toEqual('An error message');
});

it('Returns falsy if passed an array longer than a limit.', () => {
	const result = validateValue([1, 2, 3, 4, 5, 6], { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns falsy if passed an array which length is equal to a limit.', () => {
	const result = validateValue([1, 2, 3, 4, 5], { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns built-in error message if passed an array shorter than a limit.', () => {
	const result = validateValue([1, 2, 3, 4], { expected: 5 });

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toEqual(VALIDATION_MESSAGES.minLength);
});
it('Returns custom error message if passed an array shorter than a limit.', () => {
	mocked(createValidationMessage).mockName('createValidationMessage').mockReturnValueOnce('An error message');

	const result = validateValue([1, 2, 3, 4], { expected: 5, message: 'An error message pattern' });

	expect(createValidationMessage).toBeCalledTimes(1);
	expect(createValidationMessage).toBeCalledWith('An error message pattern', { expected: 5, actual: 4 });
	expect(result).toEqual('An error message');
});
