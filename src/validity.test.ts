import Validity from './validity';

const FIELD = {
	_1: 'first',
	_2: 'second',
};

describe('An empty array passed', () => {
	const validity = new Validity([]);

	test('should return an empty array of values', () => {
		expect(validity.values()).toEqual([]);
	});

	test('should return an empty array of messages', () => {
		expect(validity.getFormMessages()).toEqual([]);
	});

	test('not an error', () => {
		expect(validity.isError()).toBeFalsy();
	});

	test('valid', () => {
		expect(validity.isValid()).toBeTruthy();
	});

	test('pristine', () => {
		expect(validity.isPristine()).toBeTruthy();
	});

	test('not a dirty', () => {
		expect(validity.isDirty()).toBeFalsy();
	});

	test('does not have a message', () => {
		expect(validity.getMessage()).toBeUndefined();
		expect(validity.getMessage('any field')).toBeUndefined();
	});
});

describe('Passed single field', () => {
	const validity = new Validity([{
		name: FIELD._1,
		index: 0,
		pristine: false,
		error: false,
	}]);

	test('should return array of values', () => {
		expect(validity.values()).toEqual([{
			name: FIELD._1,
			index: 0,
			pristine: false,
			error: false,
		}]);
	});

	test('should return an empty array of messages', () => {
		expect(validity.getFormMessages()).toEqual([]);
	});

	test('not an error on a whole form', () => {
		expect(validity.isError()).toBeFalsy();
	});

	test('not an error on the field', () => {
		expect(validity.isError(FIELD._1)).toBeFalsy();
	});

	test('whole form is valid', () => {
		expect(validity.isValid()).toBeTruthy();
	});

	test('the field is valid', () => {
		expect(validity.isValid(FIELD._1)).toBeTruthy();
	});

	test('whole form is not pristine', () => {
		expect(validity.isPristine()).toBeFalsy();
	});

	test('the field is not pristine', () => {
		expect(validity.isPristine(FIELD._1)).toBeFalsy();
	});

	test('whole form is dirty', () => {
		expect(validity.isDirty()).toBeTruthy();
	});

	test('the field is dirty', () => {
		expect(validity.isDirty(FIELD._1)).toBeTruthy();
	});

	test('does not have a message', () => {
		expect(validity.getMessage(FIELD._1)).toBeUndefined();
	});
});

describe('Passed two different fields', () => {
	const validity = new Validity([{
		name: FIELD._1,
		index: 0,
		pristine: true,
		error: false,
	}, {
		name: FIELD._2,
		index: 0,
		pristine: false,
		error: true,
		message: 'An error message',
	}]);

	test('should return an array of values', () => {
		expect(validity.values()).toEqual([{
			name: FIELD._1,
			index: 0,
			pristine: true,
			error: false,
		}, {
			name: FIELD._2,
			index: 0,
			pristine: false,
			error: true,
			message: 'An error message',
		}]);
	});

	test('should return an array with one message', () => {
		expect(validity.getFormMessages()).toEqual(['An error message']);
	});

	test('form & field 2 with errors, field 1 is not', () => {
		expect(validity.isError()).toBeTruthy();
		expect(validity.isError(FIELD._1)).toBeFalsy();
		expect(validity.isError(FIELD._2)).toBeTruthy();
	});

	test('form & field 2 are invalid, field 1 is valid', () => {
		expect(validity.isValid()).toBeFalsy();
		expect(validity.isValid(FIELD._1)).toBeTruthy();
		expect(validity.isValid(FIELD._2)).toBeFalsy();
	});

	test('form & field 2 are not pristine, field 1 is pristine', () => {
		expect(validity.isPristine()).toBeFalsy();
		expect(validity.isPristine(FIELD._1)).toBeTruthy();
		expect(validity.isPristine(FIELD._2)).toBeFalsy();
	});

	test('form & field 2 are dirty, field 1 is not dirty', () => {
		expect(validity.isDirty()).toBeTruthy();
		expect(validity.isDirty(FIELD._1)).toBeFalsy();
		expect(validity.isDirty(FIELD._2)).toBeTruthy();
	});

	test('field 1 does not have a message, field 2 does have', () => {
		expect(validity.getMessage(FIELD._1)).toBeUndefined();
		expect(validity.getMessage(FIELD._2)).toBe('An error message');
	});
});
