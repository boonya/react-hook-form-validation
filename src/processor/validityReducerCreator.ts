import { FieldRule, Condition, FormPayload, FieldState } from '../types';
import validateValue from '../validators';
import { extractFieldValue } from '../helpers';

function isConditionMet(condition: Condition, payload: FormPayload, index: number): boolean {
	const [selector, ...fields] = condition;
	const values = fields.map((name) => extractFieldValue(payload, name, index));
	return selector(...values);
}

type ReducerResult = Promise<FieldState | null>;

export default function validityReducerCreator(payload: FormPayload, name: string, value: unknown, index: number) {
	return async (acc: ReducerResult, rule: FieldRule): ReducerResult => {
		const state = await acc;

		if (state && state.error) {
			return acc;
		}

		const { validator, condition, ...props } = rule;

		if (condition && isConditionMet(condition, payload, index) === false) {
			return null;
		}

		const { error, message } = await validateValue(validator, value, props);

		return {
			name,
			index,
			pristine: value === undefined,
			error,
			message,
		};
	};
}
