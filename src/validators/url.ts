import { VALIDATION_MESSAGES, ValidatorCommonParams, ValidatorResult } from '../types';
import { createValidationMessage, createValidatorResult } from '../helpers';

const PATTERN = (/^(?!\/).+?\.[a-z]{2,}(?:\/.*)?$/ui);

export default function url(input: string, messages: ValidatorCommonParams = {}): ValidatorResult {
	let fail;
	if (input && !PATTERN.test(input)) {
		fail = messages.fail
			? createValidationMessage(messages.fail)
			: VALIDATION_MESSAGES.url;
	}
	return createValidatorResult(Boolean(fail), { ...messages, fail });
}
