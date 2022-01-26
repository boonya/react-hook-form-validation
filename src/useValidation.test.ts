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
import renderHook, {act} from '../tests/render-hook';

jest.mock('./processor');
jest.mock('./helpers');

const validRuleSet: ValidationRuleSet = [{
	field: 'field_name',
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
	jest.mocked(createProcessor).mockName('createProcessor').mockReturnValue(processor);
	jest.mocked(createDefaultValidity).mockName('createDefaultValidity').mockReturnValue(defaultValidity);
	jest.mocked(processFormValidity).mockName('processFormValidity').mockResolvedValue(newValidity);
	jest.mocked(processFieldValidity).mockName('processFieldValidity').mockResolvedValue(newValidity);
	jest.mocked(validateRuleSet).mockName('validateRuleSet').mockReturnValue();
});

describe('Hook throws an error', () => {
	test('no ruleset', () => {
		jest.mocked(validateRuleSet).mockName('validateRuleSet').mockImplementation(() => {
			throw new Error('RuleSet checker throws an error');
		});
		expect(() => useValidation([])).toThrow(new Error('RuleSet checker throws an error'));
	});
});

test('Keeps default validity initially as a state', () => {
	const hook = renderHook(validRuleSet);

	expect(hook.current.validity).toBe(defaultValidity);

	expect(createProcessor).toBeCalledTimes(1);
	expect(createProcessor).toBeCalledWith(validRuleSet);
	expect(createDefaultValidity).toBeCalledTimes(1);
	expect(createDefaultValidity).toBeCalledWith(validRuleSet);
});

describe('validateForm', () => {
	test('Throws an exception if no payload', async () => {
		const hook = renderHook(validRuleSet);

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
		const hook = renderHook(validRuleSet);

		await act(async () => {
			const result = await hook.current.validateForm({});
			expect(result).toBe(newValidity);
			expect(hook.current.validity).toBe(result);
		});

		expect(createProcessor).toBeCalledTimes(1);
		expect(createProcessor).toBeCalledWith(validRuleSet);
		expect(createDefaultValidity).toBeCalledTimes(1);
		expect(createDefaultValidity).toBeCalledWith(validRuleSet);

		expect(processFormValidity).toBeCalledTimes(1);
		expect(processFormValidity).toBeCalledWith(processor, defaultValidity, {});
	});
});

describe('validateField', () => {
	test('Throws an exception if no payload', async () => {
		const hook = renderHook(validRuleSet);

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
		const hook = renderHook(validRuleSet);

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
		const hook = renderHook(validRuleSet);

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
		const hook = renderHook(validRuleSet);

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
		const hook = renderHook(validRuleSet);

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
	const hook = renderHook(validRuleSet);

	await act(async () => {
		const validity = await hook.current.validateForm({ fieldname: [''] });
		expect(validity).toBe(newValidity);
	});

	act(() => {
		const validity = hook.current.resetForm();
		expect(validity).toBe(defaultValidity);
	});
});
