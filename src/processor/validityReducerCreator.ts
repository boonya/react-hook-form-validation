import {FieldRule, Condition, FormPayload, FieldState} from '../types';
import validateValue from '../validators';
import {extractFieldValue} from '../helpers';

function isConditionMet(condition: Condition, payload: FormPayload, index: number): boolean {
	const [selector, ...fields] = condition;
	const values = fields.map((name) => extractFieldValue(payload, name, index));
	return selector(...values);
}

type ReducerAccumulator = FieldState | null;

export default function validityReducerCreator(payload: FormPayload, name: string, value: unknown, index: number) {
	return (acc: ReducerAccumulator, rule: FieldRule): ReducerAccumulator => {
		if (acc) {
			return acc;
		}

		const {validator, condition, ...props} = rule;

		if (condition && isConditionMet(condition, payload, index) === false) {
			return null;
		}

		const message = validateValue(validator, value, props);
		if (!message) {
			return null;
		}

		return {
			name,
			index,
			pristine: value === undefined,
			error: true,
			message,
		};
	};
}
