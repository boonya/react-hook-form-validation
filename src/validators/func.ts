import { ValidatorFuncParams, ValidatorAsyncFuncParams, AsyncValidatorResult } from '../types';
import { createValidatorResult } from '../helpers';

export default async function func(input: unknown, { func, ...messages }: ValidatorAsyncFuncParams | ValidatorFuncParams): AsyncValidatorResult {
	const result = await func(input);

	let valid;
	let payload: unknown[] = [];
	if (result === true || result === false) {
		valid = result;
	}
	else if (Array.isArray(result) && result.length > 0) {
		[valid, ...payload] = result;
	}
	else {
		throw new TypeError('Your function returned unexpected value');
	}

	return createValidatorResult(!valid, messages, [{input, payload}]);
}
