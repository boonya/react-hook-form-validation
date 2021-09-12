import {VALIDATION_MESSAGES, ValidatorCustomParams, ValidatorAsyncCustomParams, AsyncValidatorResult} from '../types';
import {createValidationMessage} from '../helpers';

export default async function custom(input: unknown, {func, message}: ValidatorAsyncCustomParams | ValidatorCustomParams): AsyncValidatorResult {
	if (await func(input)) {
		return null;
	}
	return message
		? createValidationMessage(message)
		: VALIDATION_MESSAGES.invalid;
}
