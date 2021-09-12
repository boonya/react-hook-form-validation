import {VALIDATION_MESSAGES, ValidatorCustomParams, ValidatorResult} from '../types';
import {createValidationMessage} from '../helpers';

export default function custom(input: unknown, {func, message}: ValidatorCustomParams): ValidatorResult {
	if (func(input)) {
		return null;
	}
	return message
		? createValidationMessage(message)
		: VALIDATION_MESSAGES.invalid;
}
