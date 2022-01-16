import { validateRequired, validateMin, validateMax, validateEmail } from '../src/index';
import Validity from '../src/validity';
import renderHook, { act } from './render-hook';

it('Several fields form with their own validators set.', async () => {
	const FIELD_1 = 'number';
	const FIELD_2 = 'string';

	const hook = renderHook([{
		field: FIELD_1,
		rules: [
			validateRequired(),
			validateMin(5),
			validateMax(25),
		],
	}, {
		field: FIELD_2,
		rules: [
			validateEmail(),
		],
	}]);

	/**
	 * By default validator does contain default validity object.
	 * The object describes every registered field as pristine and have no errors.
	 */
	expect(hook.current.validity).toEqual(new Validity([{
		name: FIELD_1,
		index: 0,
		pristine: true,
		error: false,
	}, {
		name: FIELD_2,
		index: 0,
		pristine: true,
		error: false,
	}]));

	/**
	 * What if we didn't pass a payload for all fields.
	 */
	await act(async () => {
		const result = await hook.current.validateForm({});

		expect(result).toEqual(new Validity([{
			name: FIELD_1,
			index: 0,
			pristine: true,
			error: true,
			message: 'required',
		}, {
			name: FIELD_2,
			index: 0,
			pristine: true,
			error: false,
			message: 'success',
		}]));
		/**
		 * Validator state is equal to the function result.
		 */
		expect(hook.current.validity).toEqual(result);
	});

	/**
	 * What if we passed single valid value for the first field but invalid one for the second.
	 */
	await act(async () => {
		const result = await hook.current.validateForm({ [FIELD_1]: ['10'], [FIELD_2]: ['bullshit'] });

		expect(result).toEqual(new Validity([{
			name: FIELD_1,
			index: 0,
			pristine: false,
			error: false,
			message: 'success',
		}, {
			name: FIELD_2,
			index: 0,
			pristine: false,
			error: true,
			message: 'email',
		}]));
		/**
		 * Validator state is equal to the function result.
		 */
		expect(hook.current.validity).toEqual(result);
	});

	/**
	 * What if we passed valid values for both fields.
	 */
	await act(async () => {
		const result = await hook.current.validateForm({ [FIELD_1]: [20], [FIELD_2]: ['email@example.com'] });

		expect(result).toEqual(new Validity([{
			name: FIELD_1,
			index: 0,
			pristine: false,
			error: false,
			message: 'success',
		}, {
			name: FIELD_2,
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
	 * What if we passed may values to the first field bot nothing to the second one.
	 */
	await act(async () => {
		const result = await hook.current.validateForm({ [FIELD_1]: [11, undefined, '25', 0, 28, ''] });

		expect(result).toEqual(new Validity([{
			name: FIELD_1,
			index: 0,
			pristine: false,
			error: false,
			message: 'success',
		}, {
			name: FIELD_1,
			index: 1,
			pristine: true,
			error: true,
			message: 'required',
		}, {
			name: FIELD_1,
			index: 2,
			pristine: false,
			error: false,
			message: 'success',
		}, {
			name: FIELD_1,
			index: 3,
			pristine: false,
			error: true,
			message: 'min',
		}, {
			name: FIELD_1,
			index: 4,
			pristine: false,
			error: true,
			message: 'max',
		}, {
			name: FIELD_1,
			index: 5,
			pristine: false,
			error: true,
			message: 'required',
		}, {
			name: FIELD_2,
			index: 0,
			pristine: true,
			error: false,
			message: 'success',
		}]));
		/**
		 * Validator state is equal to the function result.
		 */
		expect(hook.current.validity).toEqual(result);
	});
});
