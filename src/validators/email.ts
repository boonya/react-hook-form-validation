import {VALIDATION_MESSAGES, ValidatorCommonParams, ValidatorResult} from '../types';
import {createValidationMessage} from '../helpers';

export default function email(input: string, {message}: ValidatorCommonParams = {}): ValidatorResult {
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
