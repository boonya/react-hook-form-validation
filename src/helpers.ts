import {
	DEFAULT_FIELD_STATE,
	ValidationRuleSet,
	FormPayload,
	FormValidity,
	Processor,
	FieldState,
	ValidationMessage,
	Condition,
	ValidatorCommonParams,
	VALIDATION_MESSAGES,
	ValidatorResult,
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

export async function processFormValidity(processor: Processor, currentValidity: FormValidity, payload: FormPayload): Promise<FormValidity> {
	const promises = currentValidity
		.values()
		.reduce((acc: Promise<FieldState>[], fieldState: FieldState) => {
			const {name, index} = fieldState;
			const result = processor(payload, name, index);
			return [...acc, result];
		}, []);
	const validity = await Promise.all(promises);
	return new Validity(validity);
}

export async function processFieldValidity(processor: Processor, currentValidity: FormValidity, payload: FormPayload, name: string, index: number): Promise<FormValidity> {
	const filtered = currentValidity
		.values()
		.filter((stackItem) => stackItem.name !== name || stackItem.index !== index);
	const result = await processor(payload, name, index);
	return new Validity([...filtered, result]);
}

export function createValidationMessage(message: ValidationMessage, ...props: unknown[]): string {
	if (typeof message === 'function') {
		return message(...props);
	}
	return message;
}

export function createValidatorResult(error: boolean, messages: ValidatorCommonParams = {}, payload: unknown[] = []): ValidatorResult {
	let message = null;

	if (error) {
		message = messages.fail
			? createValidationMessage(messages.fail, ...payload)
			: VALIDATION_MESSAGES.fail;
	}
	else {
		message = messages.success
			? createValidationMessage(messages.success, ...payload)
			: VALIDATION_MESSAGES.success;
	}

	return {error, message};
}
