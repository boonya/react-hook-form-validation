import { VALIDATION_MESSAGES, ValidatorLengthParams, LengthValue, ValidatorResult } from '../types';
import { createValidationMessage } from '../helpers';

export default function max(input: LengthValue, { expected, message }: ValidatorLengthParams): ValidatorResult {
	const length = typeof input === 'number' ? input : input.length;
	if (length <= expected) {
		return null;
	}
	return message
		? createValidationMessage(message, { expected, actual: length })
		: VALIDATION_MESSAGES.max;
}
