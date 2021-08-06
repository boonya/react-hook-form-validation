import calculateValidity from './validityCalculator';
import validityReducerCreator from './validityReducerCreator';
import {mocked} from 'ts-jest/utils';
import {FormPayload, VALIDATORS} from '../types';
import {extractFieldValue} from '../helpers';

jest.mock('../helpers');
jest.mock('./validityReducerCreator');

const FIELD = {_1: 'test-field-1', _2: 'test-field-2'};
const payload: FormPayload = {[FIELD._1]: [`${FIELD._1} value`], [FIELD._2]: [`${FIELD._2} value`]};
const validityReducer = jest.fn()
	.mockName('validityReducer')
	.mockReturnValue(null);

beforeEach(() => {
	mocked(validityReducerCreator).mockName('validityReducerCreator').mockReturnValue(validityReducer);
});

test('If no ruleset and no value (value=undefined) the function returns default field validity state.', () => {
	mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(undefined);

	const result = calculateValidity([], payload, FIELD._1, 0);

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
	function executeTest() {
		const result = calculateValidity([], payload, FIELD._1, 0);

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

	test('If value is 0', () => {
		mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(0);
		executeTest();
	});

	test('If value is "0"', () => {
		mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue('0');
		executeTest();
	});

	test('If value is null', () => {
		mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(null);
		executeTest();
	});

	test('If value is ""', () => {
		mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue('');
		executeTest();
	});

	test('If value is " "', () => {
		mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(' ');
		executeTest();
	});

	test('If value is "\\n"', () => {
		mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue('\n');
		executeTest();
	});

	test('If value is an empty array', () => {
		mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue([]);
		executeTest();
	});

	test('If value is an empty onject', () => {
		mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue({});
		executeTest();
	});
});

test('If there is a single rule specified but a value and index are undefined.', () => {
	const RULESET = [{validator: VALIDATORS.required}];
	const VALUE = undefined;
	const INDEX = 0;
	mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(VALUE);

	const result = calculateValidity(RULESET, payload, FIELD._1, INDEX);

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
	expect(validityReducer).toBeCalledWith(null, RULESET[0], 0, RULESET);
});

test('If there is a single rule specified + a value and index are defined.', () => {
	const RULESET = [{validator: VALIDATORS.required}];
	const VALUE = 'a value';
	const INDEX = 2;
	mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(VALUE);

	const result = calculateValidity(RULESET, payload, FIELD._1, INDEX);

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
	expect(validityReducer).toBeCalledWith(null, RULESET[0], 0, RULESET);
});

test('If there is a several rules specified + a value and index are defined.', () => {
	const RULESET = [{validator: VALIDATORS.required}, {validator: VALIDATORS.minLength}, {validator: VALIDATORS.email}];
	const VALUE = 'a value';
	const INDEX = 2;
	mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(VALUE);
	validityReducer.mockReturnValue(null);

	const result = calculateValidity(RULESET, payload, FIELD._1, INDEX);

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
	expect(validityReducer).toBeCalledWith(null, RULESET[0], 0, RULESET);
	expect(validityReducer).toBeCalledWith(null, RULESET[1], 1, RULESET);
	expect(validityReducer).toBeCalledWith(null, RULESET[2], 2, RULESET);
});

test('If validityReducer returns new state.', () => {
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
	mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(VALUE);
	validityReducer.mockReturnValue(NEW_STATE);

	const result = calculateValidity(RULESET, payload, FIELD._1, INDEX);

	expect(result).toEqual(NEW_STATE);

	expect(extractFieldValue).toBeCalledTimes(1);
	expect(extractFieldValue).toBeCalledWith(payload, FIELD._1, INDEX);
	expect(validityReducerCreator).toBeCalledTimes(1);
	expect(validityReducerCreator).toBeCalledWith(payload, FIELD._1, VALUE, INDEX);
	expect(validityReducer).toBeCalledTimes(2);
	expect(validityReducer).toBeCalledWith(null, RULESET[0], 0, RULESET);
	expect(validityReducer).toBeCalledWith(NEW_STATE, RULESET[1], 1, RULESET);
});
