import validateValue from './sin-CA';
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
		'any value',
		'012345678',
		'111111111',
		'999999999',
		'657449110',
		'74 47 978 53',
		'744 797 853',
		'744-797-853',
		'981062432',
		'267500713',
		'2675o0713',
		'70597312',
		'7058973122',
		'069437151',
		'046454281',
		'146452286',
		'30x92544',
		'30692544',
	].forEach((value) => {
		it(`"${value}"`, () => {
			const result = validateValue(value);

			expect(createValidationMessage).toBeCalledTimes(0);
			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(true, { fail: VALIDATION_MESSAGES.sinCA });
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
		'000000000',
		'521719666',
		'469317481',
		'120217450',
		'480534858',
		'325268597',
		'336475660',
		'744797853',
		'130692544',
		'046454286',
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
