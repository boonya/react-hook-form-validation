import { VALIDATION_MESSAGES, ValidatorPatternParams, ValidatorResult, ValidatorCommonParams, VALIDATORS } from '../types';
import { createValidatorResult } from '../helpers';

export default function pattern(pattern: RegExp, props: ValidatorCommonParams = {}) {
	return { validator: VALIDATORS.pattern, pattern, ...props };
}

export function isValid(input: string, { pattern, ...rest }: ValidatorPatternParams): ValidatorResult {
	const valid = input === undefined || input === '' || pattern.test(input);

	return createValidatorResult(
		valid,
		{ fail: VALIDATION_MESSAGES.pattern, ...rest },
		[{ input }],
	);
}
