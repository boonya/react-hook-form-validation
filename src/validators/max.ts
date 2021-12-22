import { VALIDATION_MESSAGES, ValidatorLengthParams, LengthValue, ValidatorResult } from '../types';
import { createValidationMessage, createValidatorResult } from '../helpers';

export default function max(input: LengthValue, { expected, castType, ...messages }: ValidatorLengthParams): ValidatorResult {
	const value = castType ? castType(input) : input;
	const length = typeof value === 'number' ? value : value.length;

	const error = length > expected;

	let fail;
	if (error) {
		fail = messages.fail
			? createValidationMessage(messages.fail, { expected, actual: length })
			: VALIDATION_MESSAGES.max;
	}

	return createValidatorResult(error, { ...messages, fail });
}
