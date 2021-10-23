import { VALIDATION_MESSAGES, ValidatorPatternParams, ValidatorResult } from '../types';
import { createValidationMessage, createValidatorResult } from '../helpers';

export default function pattern(input: string, { pattern, ...messages }: ValidatorPatternParams): ValidatorResult {
	let fail;
	if (input && !pattern.test(input)) {
		fail = messages.fail
			? createValidationMessage(messages.fail)
			: VALIDATION_MESSAGES.pattern;
	}
	return createValidatorResult(Boolean(fail), { ...messages, fail });
}
