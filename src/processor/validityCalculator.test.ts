import calculateValidity from './validityCalculator';
import validityReducerCreator from './validityReducerCreator';
import {FormPayload, VALIDATORS} from '../types';
import {extractFieldValue} from '../helpers';

jest.mock('../helpers');
jest.mock('./validityReducerCreator');

const FIELD = {_1: 'test-field-1', _2: 'test-field-2'};
const payload: FormPayload = {[FIELD._1]: [`${FIELD._1} value`], [FIELD._2]: [`${FIELD._2} value`]};
const validityReducer = jest.fn().mockName('validityReducer');

beforeEach(() => {
	validityReducer.mockResolvedValue(null);
	jest.mocked(validityReducerCreator).mockName('validityReducerCreator').mockReturnValue(validityReducer);
});

test('If no ruleset and no value (value=undefined) the function returns default field validity state.', async () => {
	jest.mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(undefined);

	const result = await calculateValidity([], payload, FIELD._1, 0);

	expect(result).toEqual({
		name: FIELD._1,
		index: 0,
		pristine: true,
		error: false,
		message: undefined,
	});

	expect(extractFieldValue).toBeCalledTimes(1);
	expect(extractFieldValue).toBeCalledWith(payload, FIELD._1, 0);
	expect(validityReducerCreator).toBeCalledTimes(0);
	expect(validityReducer).toBeCalledTimes(0);
});

describe('If there is a value but no ruleset the function returns default field validity state but pristine=false.', () => {
	async function executeTest() {
		const result = await calculateValidity([], payload, FIELD._1, 0);

		expect(result).toEqual({
			name: FIELD._1,
			index: 0,
			pristine: false,
			error: false,
			message: undefined,
		});

		expect(extractFieldValue).toBeCalledTimes(1);
		expect(extractFieldValue).toBeCalledWith(payload, FIELD._1, 0);
		expect(validityReducerCreator).toBeCalledTimes(0);
		expect(validityReducer).toBeCalledTimes(0);
	}

	test('If value is 0', async () => {
		jest.mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(0);
		await executeTest();
	});

	test('If value is "0"', async () => {
		jest.mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue('0');
		await executeTest();
	});

	test('If value is null', async () => {
		jest.mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(null);
		await executeTest();
	});

	test('If value is ""', async () => {
		jest.mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue('');
		await executeTest();
	});

	test('If value is " "', async () => {
		jest.mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(' ');
		await executeTest();
	});

	test('If value is "\\n"', async () => {
		jest.mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue('\n');
		await executeTest();
	});

	test('If value is an empty array', async () => {
		jest.mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue([]);
		await executeTest();
	});

	test('If value is an empty object', async () => {
		jest.mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue({});
		await executeTest();
	});
});

test('If there is a single rule specified but a value and index are undefined.', async () => {
	const RULESET = [{validator: VALIDATORS.required}];
	const VALUE = undefined;
	const INDEX = 0;
	jest.mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(VALUE);

	const result = await calculateValidity(RULESET, payload, FIELD._1, INDEX);

	expect(result).toEqual({
		name: FIELD._1,
		index: INDEX,
		pristine: true,
		error: false,
		message: undefined,
	});

	expect(extractFieldValue).toBeCalledTimes(1);
	expect(extractFieldValue).toBeCalledWith(payload, FIELD._1, INDEX);
	expect(validityReducerCreator).toBeCalledTimes(1);
	expect(validityReducerCreator).toBeCalledWith(payload, FIELD._1, VALUE, INDEX);
	expect(validityReducer).toBeCalledTimes(1);
	expect(validityReducer).toBeCalledWith(Promise.resolve(null), RULESET[0], 0, RULESET);
});

test('If there is a single rule specified + a value and index are defined.', async () => {
	const RULESET = [{validator: VALIDATORS.required}];
	const VALUE = 'a value';
	const INDEX = 2;
	jest.mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(VALUE);

	const result = await calculateValidity(RULESET, payload, FIELD._1, INDEX);

	expect(result).toEqual({
		name: FIELD._1,
		index: INDEX,
		pristine: false,
		error: false,
		message: undefined,
	});

	expect(extractFieldValue).toBeCalledTimes(1);
	expect(extractFieldValue).toBeCalledWith(payload, FIELD._1, INDEX);
	expect(validityReducerCreator).toBeCalledTimes(1);
	expect(validityReducerCreator).toBeCalledWith(payload, FIELD._1, VALUE, INDEX);
	expect(validityReducer).toBeCalledTimes(1);
	expect(validityReducer).toBeCalledWith(Promise.resolve(null), RULESET[0], 0, RULESET);
});

test('If there is a several rules specified + a value and index are defined.', async () => {
	const RULESET = [{validator: VALIDATORS.required}, {validator: VALIDATORS.min}, {validator: VALIDATORS.email}];
	const VALUE = 'a value';
	const INDEX = 2;
	jest.mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(VALUE);

	const result = await calculateValidity(RULESET, payload, FIELD._1, INDEX);

	expect(result).toEqual({
		name: FIELD._1,
		index: INDEX,
		pristine: false,
		error: false,
		message: undefined,
	});

	expect(extractFieldValue).toBeCalledTimes(1);
	expect(extractFieldValue).toBeCalledWith(payload, FIELD._1, INDEX);
	expect(validityReducerCreator).toBeCalledTimes(1);
	expect(validityReducerCreator).toBeCalledWith(payload, FIELD._1, VALUE, INDEX);
	expect(validityReducer).toBeCalledTimes(3);
	expect(validityReducer).toBeCalledWith(Promise.resolve(null), RULESET[0], 0, RULESET);
	expect(validityReducer).toBeCalledWith(Promise.resolve(null), RULESET[1], 1, RULESET);
	expect(validityReducer).toBeCalledWith(Promise.resolve(null), RULESET[2], 2, RULESET);
});

test('If validityReducer returns new state.', async () => {
	const RULESET = [{validator: VALIDATORS.required}, {validator: VALIDATORS.email}];
	const VALUE = 'a value';
	const INDEX = 2;
	const NEW_STATE = {
		name: FIELD._1,
		index: INDEX,
		pristine: false,
		error: true,
		message: 'an error',
	};
	jest.mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(VALUE);
	validityReducer.mockResolvedValue(NEW_STATE);

	const result = await calculateValidity(RULESET, payload, FIELD._1, INDEX);

	expect(result).toEqual(NEW_STATE);

	expect(extractFieldValue).toBeCalledTimes(1);
	expect(extractFieldValue).toBeCalledWith(payload, FIELD._1, INDEX);
	expect(validityReducerCreator).toBeCalledTimes(1);
	expect(validityReducerCreator).toBeCalledWith(payload, FIELD._1, VALUE, INDEX);
	expect(validityReducer).toBeCalledTimes(2);
	expect(validityReducer).toBeCalledWith(Promise.resolve(null), RULESET[0], 0, RULESET);
	expect(validityReducer).toBeCalledWith(Promise.resolve(NEW_STATE), RULESET[1], 1, RULESET);
});
