import validateValue from './url';
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
	[
		'    ',
		'any value',
		'//www.boonya.info',
		'/www.boonya.info',
		// TODO: Decide why do this value fails here
		// '\\www.boonya.info',
	].forEach((value) => {
		it(`"${value}"`, () => {
			const result = validateValue(value);

			expect(createValidationMessage).toBeCalledTimes(0);
			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(true, { fail: VALIDATION_MESSAGES.url });
			expect(result).toEqual({ error: true, message: 'message' });
		});
	});

	it('custom error message', () => {
		const result = validateValue('invalid value', { fail: 'Custom error' });

		expect(createValidationMessage).toBeCalledTimes(1);
		expect(createValidationMessage).toBeCalledWith('Custom error');
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(true, { fail: 'Custom error' });
		expect(result).toEqual({ error: true, message: 'message' });
	});
});

describe('Valid', () => {
	it('empty string', () => {
		const result = validateValue('');

		expect(createValidationMessage).toBeCalledTimes(0);
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(false, { fail: undefined });
		expect(result).toEqual({ error: false, message: 'message' });
	});

	[
		'http://boonya.info',
		'http://www.boonya.info',
		'https://boonya.info',
		'https://www.boonya.info',
		'https://boonya.info/any/path/to/something',
		'www.boonya.info',
		'boonya.info',
		'boonya.info/any/path/to/something',
	].forEach((value) => {
		it(`"${value}"`, () => {
			const result = validateValue(value);

			expect(createValidationMessage).toBeCalledTimes(0);
			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(false, { fail: undefined });
			expect(result).toEqual({ error: false, message: 'message' });
		});
	});
});






