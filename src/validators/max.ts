import { VALIDATION_MESSAGES, ValidatorLengthParams, NumberValue, ValidatorResult } from '../types';
import { createValidatorResult } from '../helpers';

export default function max(input: NumberValue, { expected, ...messages }: ValidatorLengthParams): ValidatorResult {
	const actual = Number(input);
	const error = Number.isNaN(actual) || actual > expected;

	return createValidatorResult(
		error,
		{fail: VALIDATION_MESSAGES.max, ...messages},
		[{ expected, actual }]
	);
}
