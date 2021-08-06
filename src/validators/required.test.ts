import validateValue from './required';
import {createValidationMessage} from '../helpers';
import {VALIDATION_MESSAGES} from '../types';
import { mocked } from 'ts-jest/utils';

jest.mock('../helpers');
mocked(createValidationMessage).mockName('createValidationMessage');

it('Returns an error in case of undefined value.', () => {
	const result = validateValue(undefined);

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toEqual(VALIDATION_MESSAGES.required);
});

it('Returns an error in case of empty string.', () => {
	const result = validateValue('');

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toEqual(VALIDATION_MESSAGES.required);
});

it('Returns an error in case of bunch of spaces.', () => {
	const result = validateValue('   ');

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toEqual(VALIDATION_MESSAGES.required);
});

it('Returns falsy in case of zero integer.', () => {
	const result = validateValue(0);

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns falsy in case of any other integer.', () => {
	const result = validateValue(23);

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns falsy in case of any float.', () => {
	const result = validateValue(23.23);

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns an error in case of empty object.', () => {
	const result = validateValue({});

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toEqual(VALIDATION_MESSAGES.required);
});

it('Returns an error in case of empty array.', () => {
	const result = validateValue([]);

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toEqual(VALIDATION_MESSAGES.required);
});

it('Returns an error in case of null.', () => {
	const result = validateValue(null);

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toEqual(VALIDATION_MESSAGES.required);
});

it('Returns falsy in case not empty string.', () => {
	const result = validateValue('valid');

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns falsy in case not empty object.', () => {
	const result = validateValue({invalid: false});

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns falsy in case not empty array.', () => {
	const result = validateValue(['valid']);

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
});

it('Returns custom error message in case invalid value and custom message passed.', () => {
	const MESSAGE = 'custom validation message';
	mocked(createValidationMessage).mockName('createValidationMessage').mockReturnValue(MESSAGE);

	const result = validateValue('', {message: 'custom'});

	expect(createValidationMessage).toBeCalledTimes(1);
	expect(createValidationMessage).toBeCalledWith('custom');
	expect(result).toEqual(MESSAGE);
});
