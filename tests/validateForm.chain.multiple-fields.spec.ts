import { validateRequired, validateMin, validateMax, validateEmail } from '../src/index';
import Validity from '../src/validity';
import renderHook, { act } from './render-hook';

const NUMBER = 'number';
const EMAIL = 'string';

function render() {
	return renderHook([{
		field: NUMBER,
		rules: [
			validateRequired(),
			validateMin(5),
			validateMax(25),
		],
	}, {
		field: EMAIL,
		rules: [
			validateEmail(),
		],
	}]);
}

it('should contain default validity object initially.', async () => {
	const validity = render().current.validity;

	expect(validity).toEqual(new Validity([{
		name: NUMBER,
		index: 0,
		pristine: true,
		error: false,
	}, {
		name: EMAIL,
		index: 0,
		pristine: true,
		error: false,
	}]));
});

it('should validate and fail first field but not the second one.', async () => {
	const hook = render();

	await act(async () => {
		const result = await hook.current.validateForm({});

		expect(result).toEqual(new Validity([{
			name: NUMBER,
			index: 0,
			pristine: true,
			error: true,
			message: 'required',
		}, {
			name: EMAIL,
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

it('should validate and fail second field but not the first one.', async () => {
	const hook = render();

	await act(async () => {
		const result = await hook.current.validateForm({
			[NUMBER]: ['10'],
			[EMAIL]: ['bullshit']
		});

		expect(result).toEqual(new Validity([{
			name: NUMBER,
			index: 0,
			pristine: false,
			error: false,
			message: 'success',
		}, {
			name: EMAIL,
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
});

it('should validate both fields with no errors.', async () => {
	const hook = render();

	await act(async () => {
		const result = await hook.current.validateForm({
			[NUMBER]: [20],
			[EMAIL]: ['email@example.com']
		});

		expect(result).toEqual(new Validity([{
			name: NUMBER,
			index: 0,
			pristine: false,
			error: false,
			message: 'success',
		}, {
			name: EMAIL,
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

it('should validate first field for multiple times.', async () => {
	const hook = render();

	await act(async () => {
		const result = await hook.current.validateForm({
			[NUMBER]: [11, undefined, '25', 0, 28, '']
		});

		expect(result).toEqual(new Validity([{
			name: NUMBER,
			index: 0,
			pristine: false,
			error: false,
			message: 'success',
		}, {
			name: NUMBER,
			index: 1,
			pristine: true,
			error: true,
			message: 'required',
		}, {
			name: NUMBER,
			index: 2,
			pristine: false,
			error: false,
			message: 'success',
		}, {
			name: NUMBER,
			index: 3,
			pristine: false,
			error: true,
			message: 'min',
		}, {
			name: NUMBER,
			index: 4,
			pristine: false,
			error: true,
			message: 'max',
		}, {
			name: NUMBER,
			index: 5,
			pristine: false,
			error: true,
			message: 'required',
		}, {
			name: EMAIL,
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
