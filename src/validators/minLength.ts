import { VALIDATION_MESSAGES, ValidatorLengthParams, LengthValue, ValidatorResult, ValidatorCommonParams, VALIDATORS } from '../types';
import { createValidatorResult } from '../helpers';

export default function minLength(expected: number, props: ValidatorCommonParams = {}) {
	return { validator: VALIDATORS.minLength, expected, ...props };
}

export function isValid(input: LengthValue, { expected, ...messages }: ValidatorLengthParams): ValidatorResult {
	let actual;
	let valid;
	try {
		actual = [...input].length;
		valid = actual >= expected;
	}
	catch {
		valid = false;
	}

	return createValidatorResult(
		valid,
		{ fail: VALIDATION_MESSAGES.minLength, ...messages },
		[{ expected, actual }]
	);
}
