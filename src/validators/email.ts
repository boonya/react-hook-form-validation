import { VALIDATION_MESSAGES, ValidatorCommonParams, ValidatorResult } from '../types';
import { createValidatorResult } from '../helpers';

const PATTERN = /^.+@.+\..+$/ui;

export default function email(input: string, messages: ValidatorCommonParams = {}): ValidatorResult {
	const error = input !== undefined && input !== '' && !PATTERN.test(input);

	return createValidatorResult(
		error,
		{ fail: VALIDATION_MESSAGES.email, ...messages },
		[{ input }],
	);
}
