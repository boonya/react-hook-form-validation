import { createDefaultValidity, processFormValidity, processFieldValidity, validateRuleSet } from './helpers';
import createProcessor from './processor';
import {
	ValidationRuleSet,
	FormPayload,
	FormValidity,
	HookResult,
	Processor,
	ValidateFormFunction,
	ValidateFieldFunction,
	ResetFormFunction,
} from './types';
import isPlainObject from 'lodash/isPlainObject';
import React from 'react';

export default function useValidation(ruleset: ValidationRuleSet): HookResult {
	validateRuleSet(ruleset);

	const processor = React.useMemo<Processor>(() => createProcessor(ruleset), [ruleset]);
	const defaultValidity = React.useMemo<FormValidity>(() => createDefaultValidity(ruleset), [ruleset]);
	const fields = ruleset.map(({field}) => field);

	const [currentValidity, setValidity] = React.useState<FormValidity>(defaultValidity);

	const validateForm = React.useCallback<ValidateFormFunction>(async (payload: FormPayload) => {
		if (!isPlainObject(payload)) {
			throw new Error('You have to pass a form payload object to validate the form.');
		}
		const validity = await processFormValidity(processor, fields, payload);
		setValidity(validity);
		return validity;
	}, [processor, fields]);

	const validateField = React.useCallback<ValidateFieldFunction>(async (payload: FormPayload, name: string, index = 0) => {
		if (!isPlainObject(payload)) {
			throw new Error('You have to pass a form payload object to validate the field.');
		}
		if (typeof name !== 'string' || name.trim() === '') {
			throw new Error('You have to pass a field name to validate the field.');
		}
		const validity = await processFieldValidity(processor, currentValidity, payload, name, index);
		setValidity(validity);
		return validity;
	}, [currentValidity, processor]);

	const resetForm = React.useCallback<ResetFormFunction>(() => {
		setValidity(defaultValidity);
		return defaultValidity;
	}, [defaultValidity]);

	return {
		validateForm,
		validateField,
		validity: currentValidity,
		resetForm,
	};
}
