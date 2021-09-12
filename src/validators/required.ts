import {VALIDATION_MESSAGES, ValidatorCommonParams, ValidatorResult} from '../types';
import {createValidationMessage} from '../helpers';
import isEmpty from 'lodash/isEmpty';

export default function required(input: unknown, {message}: ValidatorCommonParams = {}): ValidatorResult {
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
