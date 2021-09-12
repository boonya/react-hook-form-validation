import {VALIDATION_MESSAGES, ValidatorPatternParams, ValidatorResult} from '../types';
import {createValidationMessage} from '../helpers';

export default function pattern(input: string, {pattern, message}: ValidatorPatternParams): ValidatorResult {
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
