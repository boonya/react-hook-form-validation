import {DEFAULT_FIELD_STATE, FormPayload, FieldRuleSet, FieldState} from '../types';
import createValidityReducer from './validityReducerCreator';
import {extractFieldValue} from '../helpers';

export default function validityCalculator(ruleset: FieldRuleSet, payload: FormPayload, name: string, index: number): FieldState {
	const value = extractFieldValue(payload, name, index);

	const defaultResult = {
		...DEFAULT_FIELD_STATE,
		name,
		index,
		pristine: value === undefined,
	};

	if (!ruleset || ruleset.length < 1) {
		return defaultResult;
	}

	const validityReducer = createValidityReducer(payload, name, value, index);
	const reducedResult = ruleset.reduce(validityReducer, null);
	return reducedResult || defaultResult;
}
