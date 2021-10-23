import { VALIDATION_MESSAGES, ValidatorCommonParams, ValidatorResult } from '../types';
import { createValidationMessage, createValidatorResult } from '../helpers';

const PATTERN = /^.+@.+\..+$/ui;

export default function email(input: string, messages: ValidatorCommonParams = {}): ValidatorResult {
	let fail;
	if (input && !PATTERN.test(input)) {
		fail = messages.fail
			? createValidationMessage(messages.fail)
			: VALIDATION_MESSAGES.email;
	}

	return createValidatorResult(Boolean(fail), { ...messages, fail });
}
