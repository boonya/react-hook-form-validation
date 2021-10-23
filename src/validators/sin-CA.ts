import { VALIDATION_MESSAGES, ValidatorCommonParams, ValidatorResult } from '../types';
import { createValidationMessage, createValidatorResult } from '../helpers';

function isValid(input: string) {
	// https://www.codercrunch.com/challenge/819302488/sin-validator
	if ((/^\d{9}$/ui).test(input)) {
		const digitsArray = input.split('');
		const even = digitsArray
			.filter((_, idx) => idx % 2)
			.map((i) => Number(i) * 2)
			.join('')
			.split('');

		const total = digitsArray
			.filter((_, idx) => !(idx % 2))
			.concat(even)
			.map((i) => Number(i))
			.reduce((acc, cur) => acc + cur);

		if (total % 10 === 0) {
			return true;
		}
	}
	return false;
}

export default function postalCodeCA(input: string, messages: ValidatorCommonParams = {}): ValidatorResult {
	let fail;
	if (input && !isValid(input)) {
		fail = messages.fail
			? createValidationMessage(messages.fail)
			: VALIDATION_MESSAGES.sinCA;
	}
	return createValidatorResult(Boolean(fail), { ...messages, fail });
}
