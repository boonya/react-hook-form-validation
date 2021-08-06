import {VALIDATION_MESSAGES, ValidatorCommonParams} from '../types';
import {createValidationMessage} from '../helpers';

export default function email(input: string, {message}: ValidatorCommonParams = {}): string | null {
	if (!input) {
		return null;
	}
	if ((/^.+@.+\..+$/ui).test(input)) {
		return null;
	}
	return message
		? createValidationMessage(message)
		: VALIDATION_MESSAGES.email;
}
