import { VALIDATION_MESSAGES, ValidatorAsyncCustomParams, AsyncValidatorResult } from '../types';
import { createValidationMessage } from '../helpers';

export default async function async(input: unknown, { func, message }: ValidatorAsyncCustomParams): AsyncValidatorResult {
	if (await func(input)) {
		return null;
	}
	return message
		? createValidationMessage(message)
		: VALIDATION_MESSAGES.invalid;
}
