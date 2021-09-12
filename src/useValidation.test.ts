import { ValidationRuleSet, VALIDATORS } from './types';
import useValidation from './useValidation';
import createProcessor from './processor';
import Validity from './validity';
import {
	createDefaultValidity,
	processFormValidity,
	processFieldValidity,
	validateRuleSet,
} from './helpers';
import { mocked } from 'ts-jest/utils';
import { renderHook, act } from '@testing-library/react-hooks';

jest.mock('./processor');
jest.mock('./helpers');

const validRuleSet: ValidationRuleSet = [{
	field: 'fieldname',
	rules: [{ validator: VALIDATORS.required }],
}];

const defaultValidity = new Validity([{
	name: 'field',
	index: 0,
	pristine: true,
	error: false,
}]);

const newValidity = new Validity([{
	name: 'field',
	index: 0,
	pristine: false,
	error: false,
}]);

const processor = jest.fn().mockName('processor');

beforeEach(() => {
	mocked(createProcessor).mockName('createProcessor').mockReturnValue(processor);
	mocked(createDefaultValidity).mockName('createDefaultValidity').mockReturnValue(defaultValidity);
	mocked(processFormValidity).mockName('processFormValidity').mockResolvedValue(newValidity);
	mocked(processFieldValidity).mockName('processFieldValidity').mockResolvedValue(newValidity);
	mocked(validateRuleSet).mockName('validateRuleSet').mockReturnValue();
});

function runHook() {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const { result } = renderHook(() => useValidation(validRuleSet));
	return result;
}

describe('Hook throws an error', () => {
	test('no ruleset', () => {
		mocked(validateRuleSet).mockName('validateRuleSet').mockImplementation(() => {
			throw new Error('RuleSet checker throws an error');
		});
		expect(() => useValidation([])).toThrow(new Error('RuleSet checker throws an error'));
	});
});

test('Keeps default validity initially as a state', () => {
	const hook = runHook();

	expect(hook.current.validity).toBe(defaultValidity);

	expect(createProcessor).toBeCalledTimes(1);
	expect(createProcessor).toBeCalledWith(validRuleSet);
	expect(createDefaultValidity).toBeCalledTimes(1);
	expect(createDefaultValidity).toBeCalledWith(validRuleSet);
});

describe('validateForm', () => {
	test('Throws an exception if no payload', async () => {
		const hook = runHook();

		await act(async () => {
			await expect(hook.current.validateForm()).rejects.toThrow(
				new Error('You have to pass a form payload object to validate the form.')
			);
		});

		expect(createProcessor).toBeCalledTimes(1);
		expect(createProcessor).toBeCalledWith(validRuleSet);
		expect(createDefaultValidity).toBeCalledTimes(1);
		expect(createDefaultValidity).toBeCalledWith(validRuleSet);
	});

	test('Returns new validity and changes state', async () => {
		const hook = runHook();

		await act(async () => {
			const result = await hook.current.validateForm({});
			expect(result).toBe(newValidity);
		});

		expect(createProcessor).toBeCalledTimes(1);
		expect(createProcessor).toBeCalledWith(validRuleSet);
		expect(createDefaultValidity).toBeCalledTimes(1);
		expect(createDefaultValidity).toBeCalledWith(validRuleSet);

		expect(processFormValidity).toBeCalledTimes(1);
		expect(processFormValidity).toBeCalledWith(processor, defaultValidity, {});
		expect(hook.current.validity).toBe(newValidity);
	});
});

describe('validateField', () => {
	test('Throws an exception if no payload', async () => {
		const hook = runHook();

		await act(async () => {
			await expect(hook.current.validateField()).rejects.toThrow(
				new Error('You have to pass a form payload object to validate the field.')
			);
		});

		expect(createProcessor).toBeCalledTimes(1);
		expect(createProcessor).toBeCalledWith(validRuleSet);
		expect(createDefaultValidity).toBeCalledTimes(1);
		expect(createDefaultValidity).toBeCalledWith(validRuleSet);
	});

	test('Throws an exception if no field name', async () => {
		const hook = runHook();

		await act(async () => {
			await expect(hook.current.validateField({})).rejects.toThrow(
				new Error('You have to pass a field name to validate the field.')
			);
		});

		expect(createProcessor).toBeCalledTimes(1);
		expect(createProcessor).toBeCalledWith(validRuleSet);
		expect(createDefaultValidity).toBeCalledTimes(1);
		expect(createDefaultValidity).toBeCalledWith(validRuleSet);
	});

	test('Throws an exception if field name is not a string', async () => {
		const hook = runHook();

		await act(async () => {
			await expect(hook.current.validateField({}, [])).rejects.toThrow(
				new Error('You have to pass a field name to validate the field.')
			);
		});

		expect(createProcessor).toBeCalledTimes(1);
		expect(createProcessor).toBeCalledWith(validRuleSet);
		expect(createDefaultValidity).toBeCalledTimes(1);
		expect(createDefaultValidity).toBeCalledWith(validRuleSet);
	});

	test('Throws an exception if field name is an empty string', async () => {
		const hook = runHook();

		await act(async () => {
			await expect(hook.current.validateField({}, '  ')).rejects.toThrow(
				new Error('You have to pass a field name to validate the field.')
			);
		});

		expect(createProcessor).toBeCalledTimes(1);
		expect(createProcessor).toBeCalledWith(validRuleSet);
		expect(createDefaultValidity).toBeCalledTimes(1);
		expect(createDefaultValidity).toBeCalledWith(validRuleSet);
	});

	test('Returns new validity and changes state', async () => {
		const hook = runHook();

		await act(async () => {
			const result = await hook.current.validateField({}, 'field');
			expect(result).toBe(newValidity);
		});

		expect(createProcessor).toBeCalledTimes(1);
		expect(createProcessor).toBeCalledWith(validRuleSet);
		expect(createDefaultValidity).toBeCalledTimes(1);
		expect(createDefaultValidity).toBeCalledWith(validRuleSet);

		expect(processFieldValidity).toBeCalledTimes(1);
		expect(processFieldValidity).toBeCalledWith(processor, defaultValidity, {}, 'field', 0);
		expect(hook.current.validity).toBe(newValidity);
	});
});

test('resetForm', async () => {
	const hook = runHook();

	await act(async () => {
		const validity = await hook.current.validateForm({ fieldname: [''] });
		expect(validity).toBe(newValidity);
	});

	act(() => {
		const validity = hook.current.resetForm();
		expect(validity).toBe(defaultValidity);
	});
});
