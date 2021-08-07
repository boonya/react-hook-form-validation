import {
	DEFAULT_FIELD_STATE,
	ValidationRuleSet,
	FormPayload,
	FormValidity,
	Processor,
	FieldState,
	ValidationMessage,
	Condition
} from './types';
import Validity from './validity';

function validationConditionRule(condition: Condition): void {
	if (!Array.isArray(condition)) {
		throw new TypeError('Condition property must be an array.');
	}
	const [selector, ...fields] = condition;
	if (typeof selector !== 'function') {
		throw new TypeError('Condition selector must be a function.');
	}
	if (fields.some((field) => typeof field !== 'string')) {
		throw new TypeError('Defining fields in a condition must be a string only.');
	}
}

export function validateRuleSet(ruleset: ValidationRuleSet): void {
	if (!ruleset || !ruleset.length) {
		throw new Error('No validation rules defined. It doesn\'t make sense to use validator without rules.');
	}

	ruleset.forEach(({ field, rules }) => {
		if (!field) {
			throw new Error('Undefined field in a ruleset.');
		}

		if (rules && !rules.length) {
			throw new Error(`Field "${field}" does not have validation rules defined.`);
		}

		rules && rules.forEach(({ condition }) => {
			if (condition) {
				validationConditionRule(condition);
			}
		});
	});
}

export function createDefaultValidity(rules: ValidationRuleSet): FormValidity {
	const validity = rules.map(({ field }) => ({
		...DEFAULT_FIELD_STATE,
		name: field,
	}));
	return new Validity(validity);
}

export function extractFieldValue(payload: FormPayload, name: string, index: number): unknown {
	return payload[name][index];
}

export function processFormValidity(processor: Processor, currentValidity: FormValidity, payload: FormPayload): FormValidity {
	const validity = currentValidity
		.values()
		.reduce((acc: FieldState[], fieldState: FieldState) => {
			const { name, index } = fieldState;
			const result = processor(payload, name, index);
			return [...acc, result];
		}, []);
	return new Validity(validity);
}

export function processFieldValidity(processor: Processor, currentValidity: FormValidity, payload: FormPayload, name: string, index: number): FormValidity {
	const filtered = currentValidity
		.values()
		.filter((stackItem) => stackItem.name !== name || stackItem.index !== index);
	const result = processor(payload, name, index);
	return new Validity([...filtered, result]);
}

export function createValidationMessage(message: ValidationMessage, props?: { [key: string]: unknown }): string {
	if (isFunction(message)) {
		return message(props);
	}
	return message;
}
