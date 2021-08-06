import { VALIDATION_MESSAGES, ValidatorCommonParams } from '../types';
import { createValidationMessage } from '../helpers';

export default function postalCodeCA(input: string, { message }: ValidatorCommonParams = {}): string | null {
	if (!input) {
		return null;
	}
	// https://www.codercrunch.com/challenge/819302488/sin-validator
	const sanitized = input.replace(/[\s-]/gu, '');

	if ((/^\d{9}$/ui).test(sanitized)) {
		const digitsArray = sanitized.split('');
		const even = digitsArray
			.filter((_, idx) => idx % 2)
			.map((i) => i * 2)
			.join('')
			.split('');

		const total = digitsArray
			.filter((_, idx) => !(idx % 2))
			.concat(even)
			.map((i) => Number(i))
			.reduce((acc, cur) => acc + cur);

		if (total % 10 === 0) {
			return null;
		}
	}

	return message
		? createValidationMessage(message)
		: VALIDATION_MESSAGES.sinCA;
}
