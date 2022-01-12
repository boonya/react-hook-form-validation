import { ValidatorFuncParams, ValidatorAsyncFuncParams, AsyncValidatorResult, Func, AsyncFunc, ValidatorCommonParams, VALIDATORS } from '../types';
import { createValidatorResult } from '../helpers';

export default function func(func: Func | AsyncFunc, props: ValidatorCommonParams = {}) {
	return { validator: VALIDATORS.func, func, ...props };
}

export async function isValid(input: unknown, { func, ...messages }: ValidatorAsyncFuncParams | ValidatorFuncParams): AsyncValidatorResult {
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

	return createValidatorResult(valid, messages, [{ input, payload }]);
}
