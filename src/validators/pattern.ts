import { VALIDATION_MESSAGES, ValidatorPatternParams, ValidatorResult } from '../types';
import { createValidatorResult } from '../helpers';

export default function pattern(input: string, { pattern, ...messages }: ValidatorPatternParams): ValidatorResult {
	const error = input !== undefined && input !== '' && !pattern.test(input);

	return createValidatorResult(
		error,
		{fail: VALIDATION_MESSAGES.pattern, ...messages},
		[{input}],
	);
}
