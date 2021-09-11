import validateValue from './sin-CA';
import { createValidationMessage } from '../helpers';
import { VALIDATION_MESSAGES } from '../types';
import { mocked } from 'ts-jest/utils';

jest.mock('../helpers');
mocked(createValidationMessage).mockName('createValidationMessage');

it('Should skip a falsy value.', () => {
	const result = validateValue('');

	expect(createValidationMessage).toHaveBeenCalledTimes(0);
	expect(result).toBeFalsy();
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
	it(`Returns falsy if "${value}" passed.`, () => {
		const result = validateValue(value);

		expect(createValidationMessage).toHaveBeenCalledTimes(0);
		expect(result).toBeFalsy();
	});
});

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
	it(`Returns built-in error message if "${value}" passed.`, () => {
		const result = validateValue(value);

		expect(createValidationMessage).toHaveBeenCalledTimes(0);
		expect(result).toEqual(VALIDATION_MESSAGES.sinCA);
	});

	it(`Returns custom error message if "${value}" passed.`, () => {
		mocked(createValidationMessage).mockName('createValidationMessage').mockReturnValueOnce('An error message');
		const result = validateValue(value, { message: 'An error message pattern' });

		expect(createValidationMessage).toBeCalledTimes(1);
		expect(createValidationMessage).toBeCalledWith('An error message pattern');
		expect(result).toEqual('An error message');
	});
});
