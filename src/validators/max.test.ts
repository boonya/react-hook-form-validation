import validateValue from './max';
import { createValidationMessage, createValidatorResult } from '../helpers';
import { VALIDATION_MESSAGES } from '../types';


jest.mock('../helpers');

beforeEach(() => {
	jest.mocked(createValidationMessage).mockName('createValidationMessage')
		.mockImplementation((message) => message);
	jest.mocked(createValidatorResult).mockName('createValidatorResult')
		.mockImplementation((error) => ({ error, message: 'message' }));
});

describe('Error', () => {
	it('number > expected', () => {
		const result = validateValue(6, { expected: 5 });

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(true, { fail: VALIDATION_MESSAGES.max });
		expect(result).toEqual({ error: true, message: 'message' });
	});

	it('string.length > expected', () => {
		const result = validateValue('АБВГДЕ', { expected: 5 });

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(true, { fail: VALIDATION_MESSAGES.max });
		expect(result).toEqual({ error: true, message: 'message' });
	});

	it('array.length > expected', () => {
		const result = validateValue([1, 2, 3, 4, 5, 6], { expected: 5 });

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(true, { fail: VALIDATION_MESSAGES.max });
		expect(result).toEqual({ error: true, message: 'message' });
	});

	it('custom error message', () => {
		const result = validateValue(5, { expected: -10, fail: 'Custom error' });

		expect(createValidationMessage).toBeCalledTimes(1);
		expect(createValidationMessage).toBeCalledWith('Custom error', { expected: -10, actual: 5 });
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(true, { fail: 'Custom error' });
		expect(result).toEqual({ error: true, message: 'message' });
	});
});

describe('Valid', () => {
	it('number < expected', () => {
		const result = validateValue(0, { expected: 5 });

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

	it('string.length < expected', () => {
		const result = validateValue('A', { expected: 5 });

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

	it('array.length < expected', () => {
		const result = validateValue([1], { expected: 5 });

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
