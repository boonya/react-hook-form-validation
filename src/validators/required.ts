import { VALIDATION_MESSAGES, ValidatorCommonParams, ValidatorResult } from '../types';
import { createValidationMessage, createValidatorResult } from '../helpers';
import isEmpty from 'lodash/isEmpty';

function isValid(input: unknown) {
	if (typeof input === 'number') {
		return true;
	}
	const value = typeof input === 'string' ? input.trim() : input;
	if (!isEmpty(value)) {
		return true;
	}
	return false;
}

export default function required(input: unknown, messages: ValidatorCommonParams = {}): ValidatorResult {
	let fail;
	if (!isValid(input)) {
		fail = messages.fail
			? createValidationMessage(messages.fail)
			: VALIDATION_MESSAGES.required;
	}
	return createValidatorResult(Boolean(fail), { ...messages, fail });
}
