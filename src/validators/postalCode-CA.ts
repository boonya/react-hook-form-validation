import { VALIDATION_MESSAGES, ValidatorCommonParams, ValidatorResult } from '../types';
import { createValidationMessage, createValidatorResult } from '../helpers';

const PATTERN = (/^(?!.*[DFIOQU])[A-VXY]\d[A-Z]\s?\d[A-Z]\d$/ui);

export default function postalCodeCA(input: string, messages: ValidatorCommonParams = {}): ValidatorResult {
	let fail;
	if (input && !PATTERN.test(input)) {
		fail = messages.fail
			? createValidationMessage(messages.fail)
			: VALIDATION_MESSAGES.postalCodeCA;
	}
	return createValidatorResult(Boolean(fail), { ...messages, fail });
}
