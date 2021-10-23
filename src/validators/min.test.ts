import validateValue from './min';
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

describe('Error', () => {
	it('number < expected', () => {
		const result = validateValue(4, { expected: 5 });

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(true, { fail: VALIDATION_MESSAGES.min });
		expect(result).toEqual({ error: true, message: 'message' });
	});

	it('string.length < expected', () => {
		const result = validateValue('АБВГ', { expected: 5 });

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(true, { fail: VALIDATION_MESSAGES.min });
		expect(result).toEqual({ error: true, message: 'message' });
	});

	it('array.length < expected', () => {
		const result = validateValue([1, 2, 3, 4], { expected: 5 });

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(true, { fail: VALIDATION_MESSAGES.min });
		expect(result).toEqual({ error: true, message: 'message' });
	});

	it('custom error message', () => {
		const result = validateValue(-10, { expected: 5, fail: 'Custom error' });

		expect(createValidationMessage).toBeCalledTimes(1);
		expect(createValidationMessage).toBeCalledWith('Custom error', { expected: 5, actual: -10 });
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(true, { fail: 'Custom error' });
		expect(result).toEqual({ error: true, message: 'message' });
	});
});

describe('Valid', () => {
	it('number > expected', () => {
		const result = validateValue(10, { expected: 5 });

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(false, { fail: undefined });
		expect(result).toEqual({ error: false, message: 'message' });
	});

	it('number = expected', () => {
		const result = validateValue(5, { expected: 5 });

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(false, { fail: undefined });
		expect(result).toEqual({ error: false, message: 'message' });
	});

	it('string.length > expected', () => {
		const result = validateValue('AБВГДУЁЖЗ', { expected: 5 });

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(false, { fail: undefined });
		expect(result).toEqual({ error: false, message: 'message' });
	});

	it('string.length = expected', () => {
		const result = validateValue('АБВГД', { expected: 5 });

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(false, { fail: undefined });
		expect(result).toEqual({ error: false, message: 'message' });
	});

	it('array.length > expected', () => {
		const result = validateValue([1, 2, 3, 4, 5, 6], { expected: 5 });

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(false, { fail: undefined });
		expect(result).toEqual({ error: false, message: 'message' });
	});

	it('array.length = expected', () => {
		const result = validateValue([1, 2, 3, 4, 5], { expected: 5 });

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(false, { fail: undefined });
		expect(result).toEqual({ error: false, message: 'message' });
	});
});
