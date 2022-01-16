import { validateRequired, validateMin, validateMax } from '../src/index';
import Validity from '../src/validity';
import renderHook, { act } from './render-hook';

it('Single mandatory field form that shouldn\'t allow a string shorter than 20 and longer than 35 characters.', async () => {
	const FIELD_NAME = 'string';
	const hook = renderHook([{
		field: FIELD_NAME,
		rules: [
			validateRequired(),
			validateMin(20, 'length'),
			validateMax(35, 'length'),
		],
	}]);

	/**
	 * By default validator does contain default validity object.
	 * The object describes every registered field as pristine and have no errors.
	 */
	expect(hook.current.validity).toEqual(new Validity([{
		name: FIELD_NAME,
		index: 0,
		pristine: true,
		error: false,
	}]));

	/**
	 * What if we didn't pass a payload for the field.
	 */
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

	/**
	 * What if we passed too long string.
	 */
	await act(async () => {
		const result = await hook.current.validateForm({ [FIELD_NAME]: ['A sting that longer then 20 characters.'] });

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

	/**
	 * What if we passed an empty string.
	 */
	await act(async () => {
		const result = await hook.current.validateForm({ [FIELD_NAME]: [''] });

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

	/**
	 * What if we passed a valid string.
	 */
	await act(async () => {
		const result = await hook.current.validateForm({ [FIELD_NAME]: ['A sting that has a valid length.'] });

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

	/**
	 * What if we passed a too short string.
	 */
	await act(async () => {
		const result = await hook.current.validateForm({ [FIELD_NAME]: ['not enough'] });

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

	/**
	 * What if we passed more than a single field.
	 */
	await act(async () => {
		const result = await hook.current.validateForm({ [FIELD_NAME]: ['not enough'], 'unregistered-field': ['a payload'] });

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

	/**
	 * What if we passed multiple values for the same field.
	 */
	await act(async () => {
		const result = await hook.current.validateForm({ [FIELD_NAME]: ['not enough', '', 'Good enough to have a success.'] });

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
