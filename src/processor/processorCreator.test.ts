import {ValidationRuleSet, FormPayload, FieldState} from '../types';
import processorCreator from './processorCreator';
import calculateValidity from './validityCalculator';

jest.mock('./validityCalculator');

const field = 'fieldname';
const validity: FieldState = {
	name: field,
	pristine: true,
	error: false,
};

beforeEach(() => {
	jest.mocked(calculateValidity).mockName('calculateValidity').mockResolvedValue(validity);
});

describe('Creates a processor function which retrieves a field rules and calculate validity of its payload.', () => {
	test('In case of ruleset & payload are empty.', async () => {
		const ruleset: ValidationRuleSet = [];
		const payload: FormPayload = {};

		const processor = processorCreator(ruleset);
		const result = await processor(payload, field);

		expect(result).toBe(validity);
		expect(calculateValidity).toBeCalledTimes(1);
		expect(calculateValidity).toBeCalledWith([], payload, field, undefined);
	});

	test('In case ruleset does not contain field related rules and payload is empty.', async () => {
		const ruleset: ValidationRuleSet = [{field: 'another-field', rules: 'rules', multi: true}];
		const payload: FormPayload = {};

		const processor = processorCreator(ruleset);
		const result = await processor(payload, field);

		expect(result).toBe(validity);
		expect(calculateValidity).toBeCalledTimes(1);
		expect(calculateValidity).toBeCalledWith([], payload, field, undefined);
	});

	test('In case ruleset contains field related rules and payload is empty.', async () => {
		const ruleset: ValidationRuleSet = [{field, rules: 'rules', multi: true}];
		const payload: FormPayload = {};

		const processor = processorCreator(ruleset);
		const result = await processor(payload, field);

		expect(result).toBe(validity);
		expect(calculateValidity).toBeCalledTimes(1);
		expect(calculateValidity).toBeCalledWith('rules', payload, field, undefined);
	});

	test('In case ruleset contains field related rules and payload is not empty.', async () => {
		const ruleset: ValidationRuleSet = [{field, rules: 'rules', multi: true}];
		const payload: FormPayload = {[field]: 'value 1', 'another-field': 'value 2'};

		const processor = processorCreator(ruleset);
		const result = await processor(payload, field);

		expect(result).toBe(validity);
		expect(calculateValidity).toBeCalledTimes(1);
		expect(calculateValidity).toBeCalledWith('rules', payload, field, undefined);
	});
});
