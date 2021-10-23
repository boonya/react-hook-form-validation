import {VALIDATION_MESSAGES, ValidatorLengthParams, LengthValue, ValidatorResult} from '../types';
import {createValidationMessage, createValidatorResult} from '../helpers';

export default function min(input: LengthValue, {expected, ...messages}: ValidatorLengthParams): ValidatorResult {
	const length = typeof input === 'number' ? input : input.length;

	const error = length < expected;

	let fail;
	if (error) {
		fail = messages.fail
			? createValidationMessage(messages.fail, { expected, actual: length })
			: VALIDATION_MESSAGES.min;
	}

	return createValidatorResult(error, {...messages, fail});
}
