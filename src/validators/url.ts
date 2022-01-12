import { VALIDATION_MESSAGES, ValidatorCommonParams, ValidatorResult } from '../types';
import { createValidatorResult } from '../helpers';

const PATTERN = (/^(?!\/).+?\.[a-z]{2,}(?:\/.*)?$/ui);

export default function url(input: string, messages: ValidatorCommonParams = {}): ValidatorResult {
	const error = input !== undefined && input !== '' && !PATTERN.test(input);

	return createValidatorResult(
		error,
		{fail: VALIDATION_MESSAGES.url, ...messages},
		[{input}],
	);
}
