import { FormPayload, FormValidity } from './types';
import Validity from './validity';
import {
	createDefaultValidity,
	extractFieldValue,
	processFormValidity,
	processFieldValidity,
	validateRuleSet,
	createValidationMessage,
} from './helpers';

describe('validateRuleSet', () => {
	test('ruleset undefined', () => {
		expect(() => validateRuleSet()).toThrow(new Error('No validation rules defined. It doesn\'t make sense to use validator without rules.'));
	});

	test('ruleset is empty', () => {
		expect(() => validateRuleSet([])).toThrow(new Error('No validation rules defined. It doesn\'t make sense to use validator without rules.'));
	});

	test('Field Rule does not contain a field name', () => {
		expect(() => validateRuleSet([{}])).toThrow(new Error('Undefined field in a ruleset.'));
	});

	test('Field Rule contains an empty rules', () => {
		expect(() => validateRuleSet([{ field: 'fieldname', rules: [] }])).toThrow(new Error('Field "fieldname" does not have validation rules defined.'));
	});

	test('Rule condition is falsy value', () => {
		expect(validateRuleSet([{
			field: 'fieldname',
			rules: [{ condition: '' }]
		}])).toBeUndefined();
	});

	test('Rule condition is not an array', () => {
		expect(() => validateRuleSet([{
			field: 'fieldname',
			rules: [{ condition: 'not an array' }]
		}])).toThrow(new Error('Condition property must be an array.'));
	});

	test('Rule condition selector is not a function', () => {
		expect(() => validateRuleSet([{
			field: 'fieldname',
			rules: [{ condition: ['wrong selector'] }]
		}])).toThrow(new Error('Condition selector must be a function.'));
	});

	test('Rule condition fieldname is not a string', () => {
		expect(() => validateRuleSet([{
			field: 'fieldname',
			rules: [{ condition: [() => null, null] }]
		}])).toThrow(new Error('Defining fields in a condition must be a string only.'));
	});

	test('Everything okay', () => {
		expect(validateRuleSet([{
			field: 'fieldname',
			rules: [{ condition: [() => null, 'fieldname'] }]
		}])).toBeUndefined();
	});
});

describe('createDefaultValidity', () => {
	test('Returns an empty Validity object if no ruleset.', () => {
		const result = createDefaultValidity([]);
		expect(result).toEqual(new Validity([]));
	});

	test('Returns a Validity object contains every field passed in a ruleset.', () => {
		const field = 'fieldname';

		const result = createDefaultValidity([{ field }]);

		expect(result).toEqual(new Validity([{
			pristine: true,
			error: false,
			message: undefined,
			name: field,
			index: 0,
		}]));
	});

	test('Returns a Validity object with two fields.', () => {
		const FIELD_1 = 'field-1';
		const FIELD_2 = 'field-2';

		const result = createDefaultValidity([{ field: FIELD_1 }, { field: FIELD_2 }]);

		expect(result).toEqual(new Validity([{
			pristine: true,
			error: false,
			message: undefined,
			name: FIELD_1,
			index: 0,
		}, {
			pristine: true,
			error: false,
			message: undefined,
			name: FIELD_2,
			index: 0,
		}]));
	});
});

test('extractFieldValue', () => {
	const result = extractFieldValue({ field: ['value'] }, 'field', 0);

	expect(result).toEqual('value');
});

describe('processFormValidity', () => {
	const PAYLOAD: FormPayload = { field: ['value'] };
	const PROCESSED = {
		name: 'processed-field',
		index: 234,
		pristine: false,
		error: false,
	};

	test('Returns an empty validity and does not execute processor if initial validity is empty', async () => {
		const processor = jest.fn().mockName('processor');
		const initialValidity = new Validity([]);

		const result = await processFormValidity(processor, initialValidity, PAYLOAD);

		expect(processor).toBeCalledTimes(0);
		expect(result).toEqual(new Validity([]));
	});

	test('The more initial validity we have the more processor executed times.', async () => {
		const processor = jest.fn().mockName('processor').mockReturnValue(Promise.resolve(PROCESSED));
		const initialValidity = new Validity([{
			name: 'field-1',
			index: 0,
			pristine: true,
			error: false,
		}, {
			name: 'field-1',
			index: 1,
			pristine: true,
			error: false,
		}, {
			name: 'field-2',
			index: 0,
			pristine: true,
			error: false,
		}]);

		const result = await processFormValidity(processor, initialValidity, PAYLOAD);

		expect(processor).toBeCalledTimes(3);
		expect(processor).toBeCalledWith(PAYLOAD, 'field-1', 0);
		expect(processor).toBeCalledWith(PAYLOAD, 'field-1', 1);
		expect(processor).toBeCalledWith(PAYLOAD, 'field-2', 0);
		expect(result).toEqual(new Validity([PROCESSED, PROCESSED, PROCESSED]));
	});

	// TODO: Cover the case if Promise rejected
});

describe('processFieldValidity', () => {
	const PAYLOAD: FormPayload = { field: ['value'] };
	const PROCESSED = {
		name: 'processed-field',
		index: 234,
		pristine: false,
		error: false,
	};
	const INITIAL_VALIDITY = [{
		name: 'field-1',
		index: 0,
		pristine: true,
		error: false,
	}, {
		name: 'field-1',
		index: 1,
		pristine: true,
		error: false,
	}, {
		name: 'field-2',
		index: 0,
		pristine: true,
		error: false,
	}];

	test('Processed field/index entity replaces a similar from the initial validity array.', async () => {
		const processor = jest.fn().mockName('processor').mockReturnValue(Promise.resolve(PROCESSED));
		const initialValidity = new Validity(INITIAL_VALIDITY);
		const NAME = INITIAL_VALIDITY[1].name;
		const INDEX = INITIAL_VALIDITY[1].index;

		const result = await processFieldValidity(processor, initialValidity, PAYLOAD, NAME, INDEX);

		expect(processor).toBeCalledTimes(1);
		expect(processor).toBeCalledWith(PAYLOAD, NAME, INDEX);
		expect(result).toEqual(new Validity([INITIAL_VALIDITY[0], INITIAL_VALIDITY[2], PROCESSED]));
	});

	// TODO: Cover the case if Promise rejected
});

describe('createValidationMessage', () => {
	test('Should return a string if message is a string', () => {
		expect(createValidationMessage('String value')).toBe('String value');
	});

	test('Should return result of function if message is a function', () => {
		const message = jest.fn().mockName('messageFunction').mockReturnValue('Result of function');

		expect(createValidationMessage(message, { key: 'value' })).toBe('Result of function');
		expect(message).toBeCalledTimes(1);
		expect(message).toBeCalledWith({ key: 'value' });
	});
});
