import {VALIDATION_MESSAGES, ValidatorLengthParams, LengthValue} from '../types';
import {createValidationMessage} from '../helpers';

export default function min(input: LengthValue, {expected, message}: ValidatorLengthParams): string | null {
	const length = typeof input === 'number' ? input : input.length;
	if (length >= expected) {
		return null;
	}
	return message
		? createValidationMessage(message, {expected, actual: length})
		: VALIDATION_MESSAGES.min;
}
