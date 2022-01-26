import {
	DEFAULT_FIELD_STATE,
	ValidationRuleSet,
	FormPayload,
	FormValidity,
	Processor,
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
	try {
		return payload[name][index];
	} catch {
		return undefined;
	}
}

type FieldPayload = { field: string, index: number, value: unknown };

function flattenField(field: string, payload: FormPayload) {
	const fieldPayload = payload[field];
	if (fieldPayload === undefined || !fieldPayload.length) {
		return [{ field, index: 0, value: undefined }];
	}
	return fieldPayload.map((value, index) => ({ field, index, value }));
}

function flattenForm(fields: string[], payload: FormPayload) {
	function reducer(acc: FieldPayload[], field: string) {
		return [...acc, ...flattenField(field, payload)];
	}
	return fields.reduce(reducer, []);
}

export async function processFormValidity(processor: Processor, currentValidity: FormValidity, payload: FormPayload): Promise<FormValidity> {
	const fields = currentValidity
		.values()
		.map(({ name }) => name)
		.filter((value, index, self) => self.indexOf(value) === index);
	const flatPayload = flattenForm(fields, payload);
	const promises = flatPayload.map(({ field, index }) => processor(payload, field, index));
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

export function createValidatorResult(valid: boolean, {fail, success}: ValidatorCommonParams = {}, payload: unknown[] = []): ValidatorResult {
	let message = null;

	if (valid) {
		message = success
			? createValidationMessage(success, ...payload)
			: VALIDATION_MESSAGES.success;

	}
	else {
		message = fail
			? createValidationMessage(fail, ...payload)
			: VALIDATION_MESSAGES.fail;
	}

	return { error: !valid, message };
}
