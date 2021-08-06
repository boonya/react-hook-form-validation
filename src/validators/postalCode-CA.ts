import {VALIDATION_MESSAGES, ValidatorCommonParams} from '../types';
import {createValidationMessage} from '../helpers';

export default function postalCodeCA(input: string, {message}: ValidatorCommonParams = {}): string | null {
	if (!input) {
		return null;
	}
	if ((/^(?!.*[DFIOQU])[A-VXY]\d[A-Z]\s?\d[A-Z]\d$/ui).test(input)) {
		return null;
	}
	return message
		? createValidationMessage(message)
		: VALIDATION_MESSAGES.postalCodeCA;
}
