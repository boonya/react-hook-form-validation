import {VALIDATION_MESSAGES, ValidatorCommonParams} from '../types';
import {createValidationMessage} from '../helpers';
import isEmpty from 'lodash/isEmpty';

export default function required(input: unknown, {message}: ValidatorCommonParams = {}): string | null {
	if (typeof input === 'number') {
		return null;
	}
	const value = typeof input === 'string' ? input.trim() : input;
	if (!isEmpty(value)) {
		return null;
	}
	return message
		? createValidationMessage(message)
		: VALIDATION_MESSAGES.required;
}
