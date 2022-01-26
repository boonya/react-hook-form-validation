import { validateRequired, validateFunc, validateUrl } from '../src/index';
import Validity from '../src/validity';
import renderHook, { act } from './render-hook';

const MASTER_FIELD = 'master';
const DEPENDENT_FIELD = 'dependent';

const INSTRUCTION = {
	skip: 'don\'t validate',
	url: 'validate as url',
};

function render() {
	function isInstruction(value: unknown) {
		return [
			INSTRUCTION.url,
			INSTRUCTION.skip,
		].includes(value);
	}

	return renderHook([{
		field: MASTER_FIELD,
		rules: [
			validateFunc(isInstruction),
		],
	}, {
		field: DEPENDENT_FIELD,
		rules: [
			validateRequired({ condition: [(value) => value !== INSTRUCTION.skip, MASTER_FIELD] }),
			validateFunc(() => false, { condition: [(value) => !isInstruction(value), MASTER_FIELD] }),
			validateUrl({ condition: [(value) => value === INSTRUCTION.url, MASTER_FIELD] }),
		],
	}]);
}

it('should contain default validity object initially.', async () => {
	const validity = render().current.validity;

	expect(validity).toEqual(new Validity([{
		name: MASTER_FIELD,
		index: 0,
		pristine: true,
		error: false,
	}, {
		name: DEPENDENT_FIELD,
		index: 0,
		pristine: true,
		error: false,
	}]));
});

it('should validate and fail both fields.', async () => {
	const hook = render();

	await act(async () => {
		const result = await hook.current.validateForm({});

		expect(result).toEqual(new Validity([{
			name: MASTER_FIELD,
			index: 0,
			pristine: true,
			error: true,
			message: 'fail',
		}, {
			name: DEPENDENT_FIELD,
			index: 0,
			pristine: true,
			error: true,
			message: 'required',
		}]));

		/**
		 * Validator state is equal to the function result.
		 */
		expect(hook.current.validity).toEqual(result);
	});
});

it('should validate and fail both fields.', async () => {
	const hook = render();

	await act(async () => {
		const result = await hook.current.validateForm({
			[MASTER_FIELD]: ['unacceptable'],
			[DEPENDENT_FIELD]: ['unacceptable']
		});

		expect(result).toEqual(new Validity([{
			name: MASTER_FIELD,
			index: 0,
			pristine: false,
			error: true,
			message: 'fail',
		}, {
			name: DEPENDENT_FIELD,
			index: 0,
			pristine: false,
			error: true,
			message: 'fail',
		}]));

		/**
		 * Validator state is equal to the function result.
		 */
		expect(hook.current.validity).toEqual(result);
	});
});

it('should skip validation of dependent field.', async () => {
	const hook = render();

	await act(async () => {
		const result = await hook.current.validateForm({
			[MASTER_FIELD]: ['don\'t validate'],
			[DEPENDENT_FIELD]: ['']
		});

		expect(result).toEqual(new Validity([{
			name: MASTER_FIELD,
			index: 0,
			pristine: false,
			error: false,
			message: 'success',
		}, {
			name: DEPENDENT_FIELD,
			index: 0,
			pristine: false,
			error: false,
		}]));

		/**
		 * Validator state is equal to the function result.
		 */
		expect(hook.current.validity).toEqual(result);
	});
});

it('should validate dependent field as an url with no errors.', async () => {
	const hook = render();

	await act(async () => {
		const result = await hook.current.validateForm({
			[MASTER_FIELD]: ['validate as url'],
			[DEPENDENT_FIELD]: ['http://example.com']
		});

		expect(result).toEqual(new Validity([{
			name: MASTER_FIELD,
			index: 0,
			pristine: false,
			error: false,
			message: 'success',
		}, {
			name: DEPENDENT_FIELD,
			index: 0,
			pristine: false,
			error: false,
			message: 'success',
		}]));

		/**
		 * Validator state is equal to the function result.
		 */
		expect(hook.current.validity).toEqual(result);
	});
});

it('should validate dependent field as an url with an error.', async () => {
	const hook = render();

	await act(async () => {
		const result = await hook.current.validateForm({
			[MASTER_FIELD]: ['validate as url'],
			[DEPENDENT_FIELD]: ['http:invalid']
		});

		expect(result).toEqual(new Validity([{
			name: MASTER_FIELD,
			index: 0,
			pristine: false,
			error: false,
			message: 'success',
		}, {
			name: DEPENDENT_FIELD,
			index: 0,
			pristine: false,
			error: true,
			message: 'url',
		}]));

		/**
		 * Validator state is equal to the function result.
		 */
		expect(hook.current.validity).toEqual(result);
	});
});
