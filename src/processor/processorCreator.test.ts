import {ValidationRuleSet, FormPayload, FieldState} from '../types';
import processorCreator from './processorCreator';
import calculateValidity from './validityCalculator';
import {mocked} from 'ts-jest/utils';

jest.mock('./validityCalculator');

const field = 'fieldname';
const validity: FieldState = {
	name: field,
	pristine: true,
	error: false,
};

beforeEach(() => {
	mocked(calculateValidity).mockName('calculateValidity').mockReturnValue(validity);
});

describe('Creates a processor function which retrieves a field rules and calculate validity of its payload.', () => {
	test('In case of ruleset & payload are empty.', () => {
		const ruleset: ValidationRuleSet = [];
		const payload: FormPayload = {};

		const result = processorCreator(ruleset)(payload, field);

		expect(result).toBe(validity);
		expect(calculateValidity).toBeCalledTimes(1);
		expect(calculateValidity).toBeCalledWith([], payload, field, undefined);
	});

	test('In case ruleset does not contain field related rules and payload is empty.', () => {
		const ruleset: ValidationRuleSet = [{field: 'another-field', rules: 'rules', multi: true}];
		const payload: FormPayload = {};

		const result = processorCreator(ruleset)(payload, field);

		expect(result).toBe(validity);
		expect(calculateValidity).toBeCalledTimes(1);
		expect(calculateValidity).toBeCalledWith([], payload, field, undefined);
	});

	test('In case ruleset contains field related rules and payload is empty.', () => {
		const ruleset: ValidationRuleSet = [{field, rules: 'rules', multi: true}];
		const payload: FormPayload = {};

		const result = processorCreator(ruleset)(payload, field);

		expect(result).toBe(validity);
		expect(calculateValidity).toBeCalledTimes(1);
		expect(calculateValidity).toBeCalledWith('rules', payload, field, undefined);
	});

	test('In case ruleset contains field related rules and payload is not empty.', () => {
		const ruleset: ValidationRuleSet = [{field, rules: 'rules', multi: true}];
		const payload: FormPayload = {[field]: 'value 1', 'another-field': 'value 2'};

		const result = processorCreator(ruleset)(payload, field);

		expect(result).toBe(validity);
		expect(calculateValidity).toBeCalledTimes(1);
		expect(calculateValidity).toBeCalledWith('rules', payload, field, undefined);
	});
});
