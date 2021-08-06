import { VALIDATION_MESSAGES, ValidatorCommonParams } from '../types';
import { createValidationMessage } from '../helpers';

export default function url(input: string, params?: ValidatorCommonParams): string | null {
	if (!input) {
		return null;
	}
	const { message } = params || {};
	if ((/^(?!\/).+?\.[a-z]{2,}(?:\/.*)?$/ui).test(input)) {
		return null;
	}
	return message
		? createValidationMessage(message)
		: VALIDATION_MESSAGES.url;
}
