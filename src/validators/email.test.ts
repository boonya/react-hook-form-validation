import validateValue from './email';
import {createValidationMessage} from '../helpers';
import {VALIDATION_MESSAGES} from '../types';
import {mocked} from 'ts-jest/utils';

jest.mock('../helpers');
mocked(createValidationMessage).mockName('createValidationMessage');

it('Returns falsy in case of undefined value.', () => {
	const result = validateValue();

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns falsy in case of empty value.', () => {
	const result = validateValue('');

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns falsy in case of valid value.', () => {
	const result = validateValue('anyone@gmail.com');

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns an error in case of invalid email.', () => {
	const result = validateValue('invalid');

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toEqual(VALIDATION_MESSAGES.email);
});

it('Returns custom error message in case invalid value and custom message passed as a function.', () => {
	const MESSAGE = 'custom validation message';
	mocked(createValidationMessage).mockName('createValidationMessage').mockReturnValue(MESSAGE);

	const result = validateValue('invalid', {message: 'custom'});

	expect(createValidationMessage).toBeCalledTimes(1);
	expect(createValidationMessage).toBeCalledWith('custom');
	expect(result).toEqual(MESSAGE);
});
