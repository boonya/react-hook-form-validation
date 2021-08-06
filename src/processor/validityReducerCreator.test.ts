import {FieldRule, FormPayload, FieldState, VALIDATORS} from '../types';
import validateValue from '../validators';
import {extractFieldValue} from '../helpers';
import validityReducerCreator from './validityReducerCreator';
import {mocked} from 'ts-jest/utils';

jest.mock('../validators');
jest.mock('../helpers');

const FIELDS = {
	_1: 'field1',
	_2: 'field2',
};

beforeEach(() => {
	mocked(validateValue).mockName('validateValue').mockReturnValue(null);
	mocked(extractFieldValue).mockName('extractFieldValue').mockReturnValue(undefined);
});

const INDEX = 0;

describe('Check condition if passed', () => {
	const PAYLOAD: FormPayload = {};
	const FIELD = FIELDS._1;
	const VALUE = 'a value';
	const ERROR_MESSAGE = 'An error message';

	test('Returns null if the condition is not met. Condition selector receives no args.', () => {
		const conditionSelector = jest.fn(() => false).mockName('conditionSelector');
		const FIELD_RULE: FieldRule = {validator: VALIDATORS.required, condition: [conditionSelector]};
		mocked(validateValue).mockName('validateValue').mockReturnValue(ERROR_MESSAGE);

		const result = validityReducerCreator(PAYLOAD, FIELD, VALUE, INDEX)(null, FIELD_RULE);

		expect(conditionSelector).toBeCalledTimes(1);
		expect(conditionSelector).toBeCalledWith();
		expect(extractFieldValue).toBeCalledTimes(0);
		expect(validateValue).toBeCalledTimes(0);

		expect(result).toBeNull();
	});

	test('Returns null if the condition is not met. Condition selector receives some args.', () => {
		const conditionSelector = jest.fn(() => false).mockName('conditionSelector');
		const FIELD_NAMES = [FIELDS._1, FIELDS._1];
		const FIELD_RULE: FieldRule = {validator: VALIDATORS.required, condition: [conditionSelector, ...FIELD_NAMES]};
		mocked(extractFieldValue).mockName('extractFieldValue')
			.mockReturnValueOnce(`${FIELDS._1} value`)
			.mockReturnValueOnce(`${FIELDS._2} value`);
		mocked(validateValue).mockName('validateValue').mockReturnValue(ERROR_MESSAGE);

		const result = validityReducerCreator(PAYLOAD, FIELD, VALUE, INDEX)(null, FIELD_RULE);

		expect(conditionSelector).toBeCalledTimes(1);
		expect(conditionSelector).toBeCalledWith(`${FIELDS._1} value`, `${FIELDS._2} value`);
		expect(extractFieldValue).toBeCalledTimes(2);
		expect(extractFieldValue).toBeCalledWith(PAYLOAD, FIELD_NAMES[0], INDEX);
		expect(extractFieldValue).toBeCalledWith(PAYLOAD, FIELD_NAMES[1], INDEX);
		expect(validateValue).toBeCalledTimes(0);

		expect(result).toBeNull();
	});

	test('Executes the subordinate code if the condition is met.', () => {
		const conditionSelector = jest.fn(() => true).mockName('conditionSelector');
		const FIELD_NAMES = [FIELDS._1, FIELDS._1];
		const FIELD_RULE: FieldRule = {validator: VALIDATORS.required, condition: [conditionSelector, ...FIELD_NAMES]};
		mocked(extractFieldValue).mockName('extractFieldValue')
			.mockReturnValueOnce(`${FIELDS._1} value`)
			.mockReturnValueOnce(`${FIELDS._2} value`);

		const result = validityReducerCreator(PAYLOAD, FIELD, VALUE, INDEX)(null, FIELD_RULE);

		expect(conditionSelector).toBeCalledTimes(1);
		expect(conditionSelector).toBeCalledWith(`${FIELDS._1} value`, `${FIELDS._2} value`);
		expect(extractFieldValue).toBeCalledTimes(2);
		expect(extractFieldValue).toBeCalledWith(PAYLOAD, FIELD_NAMES[0], INDEX);
		expect(extractFieldValue).toBeCalledWith(PAYLOAD, FIELD_NAMES[1], INDEX);
		expect(validateValue).toBeCalledTimes(1);

		expect(result).toBeNull();
	});
});

test('Returns null if validation does not produce an error.', () => {
	const PAYLOAD: FormPayload = {};
	const FIELD = FIELDS._1;
	const VALUE = 'a value';
	const FIELD_RULE: FieldRule = {validator: VALIDATORS.required};

	const result = validityReducerCreator(PAYLOAD, FIELD, VALUE, INDEX)(null, FIELD_RULE);

	expect(extractFieldValue).toBeCalledTimes(0);
	expect(validateValue).toBeCalledTimes(1);
	expect(validateValue).toBeCalledWith(VALIDATORS.required, VALUE, {});

	expect(result).toBeNull();
});

describe('Returns FieldState object if validation produces any error.', () => {
	const PAYLOAD: FormPayload = {};
	const FIELD = FIELDS._1;
	const ERROR_MESSAGE = 'An error message';

	function executeTest(value: unknown) {
		const FIELD_RULE: FieldRule = {validator: VALIDATORS.required};
		mocked(validateValue).mockName('validateValue').mockReturnValue(ERROR_MESSAGE);

		const result = validityReducerCreator(PAYLOAD, FIELD, value, INDEX)(null, FIELD_RULE);

		expect(extractFieldValue).toBeCalledTimes(0);
		expect(validateValue).toBeCalledTimes(1);
		expect(validateValue).toBeCalledWith(VALIDATORS.required, value, {});

		return result;
	}

	test('If value is undefined', () => {
		const result = executeTest(undefined);

		expect(result).toEqual({
			name: FIELD,
			index: INDEX,
			pristine: true,
			error: true,
			message: ERROR_MESSAGE,
		});
	});

	test('If value is null', () => {
		const result = executeTest(null);

		expect(result).toEqual({
			name: FIELD,
			index: INDEX,
			pristine: false,
			error: true,
			message: ERROR_MESSAGE,
		});
	});

	test('If value is a zero', () => {
		const result = executeTest(0);

		expect(result).toEqual({
			name: FIELD,
			index: INDEX,
			pristine: false,
			error: true,
			message: ERROR_MESSAGE,
		});
	});

	test('If value is an empty string', () => {
		const result = executeTest('');

		expect(result).toEqual({
			name: FIELD,
			index: INDEX,
			pristine: false,
			error: true,
			message: ERROR_MESSAGE,
		});
	});

	test('If value is some string', () => {
		const result = executeTest('a value');

		expect(result).toEqual({
			name: FIELD,
			index: INDEX,
			pristine: false,
			error: true,
			message: ERROR_MESSAGE,
		});
	});
});

test('Returns the same FieldState object if it is in an accumulator.', () => {
	const PAYLOAD: FormPayload = {};
	const FIELD = FIELDS._1;
	const VALUE = 'a value';
	const FIELD_RULE: FieldRule = {validator: VALIDATORS.required};
	const ERROR_MESSAGE = 'An error message';
	const FIELD_STATE: FieldState = {
		name: FIELD,
		index: INDEX,
		pristine: true,
		error: true,
		message: ERROR_MESSAGE,
	};

	const result = validityReducerCreator(PAYLOAD, FIELD, VALUE, INDEX)(FIELD_STATE, FIELD_RULE);

	expect(extractFieldValue).toBeCalledTimes(0);
	expect(validateValue).toBeCalledTimes(0);

	expect(result).toEqual(FIELD_STATE);
});
