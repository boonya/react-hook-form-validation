import { validateRequired, validateFunc, validateUrl, validateEmail, validatePattern } from '../src/index';
import Validity from '../src/validity';
import renderHook, { act } from './render-hook';

it('Several fields form with their own validators set.', async () => {
	const MASTER_FIELD = 'master';
	const DEPENDENT_FIELD = 'dependent';

	function isExpectableString(value) {
		return [
			'validate as url',
			'validate as email',
			'validate by pattern',
			'don\'t validate'
		].includes(value);
	}

	const hook = renderHook([{
		field: MASTER_FIELD,
		rules: [
			validateFunc(isExpectableString),
		],
	}, {
		field: DEPENDENT_FIELD,
		rules: [
			validateRequired({ condition: [(value) => value !== 'don\'t validate', MASTER_FIELD] }),
			validateFunc(() => false, { condition: [(value) => !isExpectableString(value), MASTER_FIELD] }),
			validateUrl({ condition: [(value) => value === 'validate as url', MASTER_FIELD] }),
			validateEmail({ condition: [(value) => value === 'validate as email', MASTER_FIELD] }),
			validatePattern(/^(?!.*[DFIOQU])[A-VXY]\d[A-Z]\s?\d[A-Z]\d$/ui, { condition: [(value) => value === 'validate by pattern', MASTER_FIELD] }),
		],
	}]);

	/**
	 * By default validator does contain default validity object.
	 * The object describes every registered field as pristine and have no errors.
	 */
	// expect(hook.current.validity).toEqual(new Validity([{
	// 	name: MASTER_FIELD,
	// 	index: 0,
	// 	pristine: true,
	// 	error: false,
	// }, {
	// 	name: DEPENDENT_FIELD,
	// 	index: 0,
	// 	pristine: true,
	// 	error: false,
	// }]));

	// /**
	//  * What if we didn't pass a payload for all fields.
	//  */
	// await act(async () => {
	// 	const result = await hook.current.validateForm({});

	// 	expect(result).toEqual(new Validity([{
	// 		name: MASTER_FIELD,
	// 		index: 0,
	// 		pristine: true,
	// 		error: true,
	// 		message: 'fail',
	// 	}, {
	// 		name: DEPENDENT_FIELD,
	// 		index: 0,
	// 		pristine: true,
	// 		error: true,
	// 		message: 'required',
	// 	}]));
	// 	/**
	// 	 * Validator state is equal to the function result.
	// 	 */
	// 	expect(hook.current.validity).toEqual(result);
	// });

	// /**
	//  * What if we passed unacceptable value to both fields.
	//  */
	// await act(async () => {
	// 	const result = await hook.current.validateForm({ [MASTER_FIELD]: ['unacceptable'], [DEPENDENT_FIELD]: ['unacceptable'] });

	// 	expect(result).toEqual(new Validity([{
	// 		name: MASTER_FIELD,
	// 		index: 0,
	// 		pristine: false,
	// 		error: true,
	// 		message: 'fail',
	// 	}, {
	// 		name: DEPENDENT_FIELD,
	// 		index: 0,
	// 		pristine: false,
	// 		error: true,
	// 		message: 'fail',
	// 	}]));
	// 	/**
	// 	 * Validator state is equal to the function result.
	// 	 */
	// 	expect(hook.current.validity).toEqual(result);
	// });

	// /**
	//  * What if we passed a valid value to the first and dependent field shouldn't be validated then.
	//  */
	// await act(async () => {
	// 	const result = await hook.current.validateForm({ [MASTER_FIELD]: ['don\'t validate'], [DEPENDENT_FIELD]: [''] });

	// 	expect(result).toEqual(new Validity([{
	// 		name: MASTER_FIELD,
	// 		index: 0,
	// 		pristine: false,
	// 		error: false,
	// 		message: 'success',
	// 	}, {
	// 		name: DEPENDENT_FIELD,
	// 		index: 0,
	// 		pristine: false,
	// 		error: false,
	// 		// message: 'success', // FIXME: I don't know yet
	// 	}]));
	// 	/**
	// 	 * Validator state is equal to the function result.
	// 	 */
	// 	expect(hook.current.validity).toEqual(result);
	// });

	/**
	 * What if we passed a valid value to the first and dependent field validated successfully.
	 */
	await act(async () => {
		const result = await hook.current.validateForm({ [MASTER_FIELD]: ['validate as url'], [DEPENDENT_FIELD]: ['http://example.com'] });

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
			message: 'success', // FIXME: I don't know yet
		}]));
		/**
		 * Validator state is equal to the function result.
		 */
		expect(hook.current.validity).toEqual(result);
	});
});
