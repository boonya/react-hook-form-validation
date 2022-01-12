import { VALIDATION_MESSAGES, ValidatorCommonParams, ValidatorResult, VALIDATORS } from '../types';
import { createValidatorResult } from '../helpers';

export default function create(props: ValidatorCommonParams = {}) {
	return {validator: VALIDATORS.email, ...props};
}

const PATTERN = /^.+@.+\..+$/ui;

export function isValid(input: string, messages: ValidatorCommonParams = {}): ValidatorResult {
	const valid = input === undefined || input === '' || PATTERN.test(input);

	return createValidatorResult(
		valid,
		{ fail: VALIDATION_MESSAGES.email, ...messages },
		[{ input }],
	);
}
