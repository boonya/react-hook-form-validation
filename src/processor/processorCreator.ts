import {FormPayload, ValidationRuleSet, FieldRuleSet, Processor} from '../types';
import calculateValidity from './validityCalculator';

function getFieldRules(ruleset: ValidationRuleSet, fieldName: string): FieldRuleSet {
	const {rules} = ruleset.find(({field}) => field === fieldName) || {};
	return rules || [];
}

export default function processorCreator(ruleset: ValidationRuleSet): Processor {
	return (payload: FormPayload, field: string, index: number) => {
		const rules = getFieldRules(ruleset, field);
		return calculateValidity(rules, payload, field, index);
	};
}
