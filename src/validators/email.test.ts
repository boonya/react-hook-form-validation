import validateValue from './email';
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
	it('email is spaces', () => {
		const result = validateValue('   ');

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(true, { fail: VALIDATION_MESSAGES.email });
		expect(result).toEqual({ error: true, message: 'message' });
	});

	it('invalid email', () => {
		const result = validateValue('invalid');

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(true, { fail: VALIDATION_MESSAGES.email });
		expect(result).toEqual({ error: true, message: 'message' });
	});

	it('Custom message', () => {
		const result = validateValue('invalid', { fail: 'Custom error' });

		expect(createValidationMessage).toBeCalledTimes(1);
		expect(createValidationMessage).toBeCalledWith('Custom error');
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(true, { fail: 'Custom error' });
		expect(result).toEqual({ error: true, message: 'message' });
	});
});

describe('Valid', () => {
	it('email is undefined', () => {
		const result = validateValue(undefined);

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(false, { fail: undefined });
		expect(result).toEqual({ error: false, message: 'message' });
	});

	it('email is empty', () => {
		const result = validateValue('');

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(false, { fail: undefined });
		expect(result).toEqual({ error: false, message: 'message' });
	});

	it('valid email', () => {
		const result = validateValue('anyone@gmail.com');

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(false, { fail: undefined });
		expect(result).toEqual({ error: false, message: 'message' });
	});
});
