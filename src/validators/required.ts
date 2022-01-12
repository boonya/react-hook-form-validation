import { VALIDATION_MESSAGES, ValidatorCommonParams, ValidatorResult } from '../types';
import { createValidatorResult } from '../helpers';
import isEmpty from 'lodash/isEmpty';

function isValid(input: unknown) {
	if (typeof input === 'number') {
		return true;
	}
	const value = typeof input === 'string' ? input.trim() : input;
	return !isEmpty(value);
}

export default function required(input: unknown, messages: ValidatorCommonParams = {}): ValidatorResult {
	return createValidatorResult(
		!isValid(input),
		{ fail: VALIDATION_MESSAGES.required, ...messages },
		[{ input }],
	);
}
