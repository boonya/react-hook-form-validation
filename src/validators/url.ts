import { VALIDATION_MESSAGES, ValidatorCommonParams, ValidatorResult } from '../types';
import { createValidationMessage } from '../helpers';

export default function url(input: string, { message }: ValidatorCommonParams = {}): ValidatorResult {
	if (!input) {
		return null;
	}
	if ((/^(?!\/).+?\.[a-z]{2,}(?:\/.*)?$/ui).test(input)) {
		return null;
	}
	return message
		? createValidationMessage(message)
		: VALIDATION_MESSAGES.url;
}
