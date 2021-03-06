import { VALIDATION_MESSAGES, ValidatorCommonParams, ValidatorResult, VALIDATORS } from '../types';
import { createValidatorResult } from '../helpers';

export default function create(props: ValidatorCommonParams = {}) {
	return { validator: VALIDATORS.url, ...props };
}

const PATTERN = (/^(?!\/).+?\.[a-z]{2,}(?:\/.*)?$/ui);

export function isValid(input: string, rest: ValidatorCommonParams = {}): ValidatorResult {
	const valid = input === undefined || input === '' || PATTERN.test(input);

	return createValidatorResult(
		valid,
		{ fail: VALIDATION_MESSAGES.url, ...rest },
		[{ input }],
	);
}
