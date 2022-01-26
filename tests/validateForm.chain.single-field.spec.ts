import { validateRequired, validateMin, validateMax } from '../src/index';
import Validity from '../src/validity';
import renderHook, { act } from './render-hook';

const FIELD_NAME = 'string';

function render() {
	return renderHook([{
		field: FIELD_NAME,
		rules: [
			validateRequired(),
			validateMin(20, 'length'),
			validateMax(35, 'length'),
		],
	}]);
}

it('should contain default validity object initially.', async () => {
	const validity = render().current.validity;

	expect(validity).toEqual(new Validity([{
		name: FIELD_NAME,
		index: 0,
		pristine: true,
		error: false,
	}]));
});

it('should validate and fail as mandatory.', async () => {
	const hook = render();

	await act(async () => {
		const result = await hook.current.validateForm({ [FIELD_NAME]: [] });

		expect(result).toEqual(new Validity([{
			name: FIELD_NAME,
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

it('should validate and fail as longer than max.', async () => {
	const hook = render();

	await act(async () => {
		const result = await hook.current.validateForm({
			[FIELD_NAME]: ['A sting that longer then 20 characters.']
		});

		expect(result).toEqual(new Validity([{
			name: FIELD_NAME,
			index: 0,
			pristine: false,
			error: true,
			message: 'max',
		}]));

		/**
		 * Validator state is equal to the function result.
		 */
		expect(hook.current.validity).toEqual(result);
	});
});

it('should validate and fail as required.', async () => {
	const hook = render();

	await act(async () => {
		const result = await hook.current.validateForm({
			[FIELD_NAME]: ['']
		});

		expect(result).toEqual(new Validity([{
			name: FIELD_NAME,
			index: 0,
			pristine: false,
			error: true,
			message: 'required',
		}]));

		/**
		 * Validator state is equal to the function result.
		 */
		expect(hook.current.validity).toEqual(result);
	});
});

it('should validate with no errors.', async () => {
	const hook = render();

	await act(async () => {
		const result = await hook.current.validateForm({
			[FIELD_NAME]: ['A sting that has a valid length.']
		});

		expect(result).toEqual(new Validity([{
			name: FIELD_NAME,
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

it('should validate and fail as not enough characters.', async () => {
	const hook = render();

	await act(async () => {
		const result = await hook.current.validateForm({
			[FIELD_NAME]: ['not enough']
		});

		expect(result).toEqual(new Validity([{
			name: FIELD_NAME,
			index: 0,
			pristine: false,
			error: true,
			message: 'min',
		}]));

		/**
		 * Validator state is equal to the function result.
		 */
		expect(hook.current.validity).toEqual(result);
	});
});

it('should validate with no error even if unregistered field passed.', async () => {
	const hook = render();
	/**
	 * What if we passed more than a single field.
	 */
	await act(async () => {
		const result = await hook.current.validateForm({
			[FIELD_NAME]: ['A sting that has a valid length.'],
			'unregistered-field': ['a payload']
		});

		expect(result).toEqual(new Validity([{
			name: FIELD_NAME,
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

it('should validate field for the multiple times.', async () => {
	const hook = render();

	await act(async () => {
		const result = await hook.current.validateForm({
			[FIELD_NAME]: ['not enough', '', 'Good enough to have a success.']
		});

		expect(result).toEqual(new Validity([{
			name: FIELD_NAME,
			index: 0,
			pristine: false,
			error: true,
			message: 'min',
		}, {
			name: FIELD_NAME,
			index: 1,
			pristine: false,
			error: true,
			message: 'required',
		}, {
			name: FIELD_NAME,
			index: 2,
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
