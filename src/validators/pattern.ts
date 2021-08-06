import {VALIDATION_MESSAGES, ValidatorPatternParams} from '../types';
import {createValidationMessage} from '../helpers';

export default function pattern(input: string, {pattern, message}: ValidatorPatternParams): string | null {
	if (!input) {
		return null;
	}
	if (pattern.test(input)) {
		return null;
	}
	return message
		? createValidationMessage(message)
		: VALIDATION_MESSAGES.pattern;
}
