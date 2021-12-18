import validateValue from './postalCode-CA';
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
	[
		'        ',
		'invalid value',
		'a1a1a',
		'A1A  1A1',
		'K1A 0D1',
		'W1A 0B1',
		'Z1A 0B1',
	].forEach((value) => {
		it(`"${value}"`, () => {
			const result = validateValue(value);

			expect(createValidationMessage).toBeCalledTimes(0);
			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(true, { fail: VALIDATION_MESSAGES.postalCodeCA });
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
		'A1C 3S4',
		'A1C3S4',
		'a1c 3s4',
		'V9A 7N2',
		'B3K 5X5',
		'K8N 5W6',
		'K1A 0B1',
		'B1Z 0B9',
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
