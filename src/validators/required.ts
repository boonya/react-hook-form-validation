import { VALIDATION_MESSAGES, ValidatorCommonParams, ValidatorResult, VALIDATORS } from '../types';
import { createValidatorResult } from '../helpers';
import isEmpty from 'lodash/isEmpty';

export default function create(props: ValidatorCommonParams = {}) {
	return { validator: VALIDATORS.required, ...props };
}

function check(input: unknown) {
	if (typeof input === 'number') {
		return true;
	}
	const value = typeof input === 'string' ? input.trim() : input;
	return !isEmpty(value);
}

export function isValid(input: unknown, rest: ValidatorCommonParams = {}): ValidatorResult {
	return createValidatorResult(
		check(input),
		{ fail: VALIDATION_MESSAGES.required, ...rest },
		[{ input }],
	);
}
