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
import isString from 'lodash/isString';
import React from 'react';

export default function useValidation(ruleset: ValidationRuleSet): HookResult {
	validateRuleSet(ruleset);

	const processor = React.useMemo<Processor>(() => createProcessor(ruleset), [ruleset]);
	const defaultValidity = React.useMemo<FormValidity>(() => createDefaultValidity(ruleset), [ruleset]);

	const [currentValidity, setValidity] = React.useState<FormValidity>(defaultValidity);

	const validateForm = React.useCallback<ValidateFormFunction>((payload: FormPayload) => {
		if (!isPlainObject(payload)) {
			throw new Error('You have to pass a form payload object to validate the form.');
		}
		const validity = processFormValidity(processor, currentValidity, payload);
		setValidity(validity);
		return validity;
	}, [currentValidity, processor]);

	const validateField = React.useCallback<ValidateFieldFunction>((payload: FormPayload, name: string, index = 0) => {
		if (!isPlainObject(payload)) {
			throw new Error('You have to pass a form payload object to validate the field.');
		}
		if (!isString(name) || name.trim() === '') {
			throw new Error('You have to pass a field name to validate the field.');
		}
		const validity = processFieldValidity(processor, currentValidity, payload, name, index);
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
