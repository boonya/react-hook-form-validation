import {VALIDATION_MESSAGES, ValidatorCustomParams} from '../types';
import {createValidationMessage} from '../helpers';

export default function custom(input: unknown, {func, message}: ValidatorCustomParams): string | null {
	if (func(input)) {
		return null;
	}
	return message
		? createValidationMessage(message)
		: VALIDATION_MESSAGES.invalid;
}
