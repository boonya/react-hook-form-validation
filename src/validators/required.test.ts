import validateValue from './required';
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
		undefined,
		'',
		'   ',
		{},
		[],
		null,
	].forEach((value) => {
		const label = `${typeof value} -> ${JSON.stringify(value)}`;
		it(label, () => {
			const result = validateValue(value);

			expect(createValidationMessage).toBeCalledTimes(0);
			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(true, { fail: VALIDATION_MESSAGES.required });
			expect(result).toEqual({ error: true, message: 'message' });
		});
	});

	it('custom error message', () => {
		const result = validateValue('', { fail: 'Custom error' });

		expect(createValidationMessage).toBeCalledTimes(1);
		expect(createValidationMessage).toBeCalledWith('Custom error');
		expect(createValidatorResult).toBeCalledTimes(1);
		expect(createValidatorResult).toBeCalledWith(true, { fail: 'Custom error' });
		expect(result).toEqual({ error: true, message: 'message' });
	});
});

describe('Valid', () => {
	[
		0,
		23,
		23.23,
		-41,
		'valid',
		{ error: false },
		['valid'],
		[false],
		[null],
	].forEach((value) => {
		const label = `${typeof value} -> ${JSON.stringify(value)}`;
		it(label, () => {
			const result = validateValue(value);

			expect(createValidationMessage).toBeCalledTimes(0);
			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(false, { fail: undefined });
			expect(result).toEqual({ error: false, message: 'message' });
		});
	});
});
