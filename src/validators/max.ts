import { VALIDATION_MESSAGES, ValidatorLengthParams, NumberValue, ValidatorResult, ValidatorCommonParams, VALIDATORS } from '../types';
import { createValidatorResult } from '../helpers';

export default function max(expected: number, props: ValidatorCommonParams = {}) {
	return { validator: VALIDATORS.max, expected, ...props };
}

function check(number: number, expected: number) {
	return !Number.isNaN(number) && number <= expected;
}

export function isValid(input: NumberValue, { expected, ...messages }: ValidatorLengthParams): ValidatorResult {
	const number = Number(input);
	const valid = input === undefined || input === '' || check(number, expected);

	return createValidatorResult(
		valid,
		{ fail: VALIDATION_MESSAGES.max, ...messages },
		[{ expected, actual: number }]
	);
}
