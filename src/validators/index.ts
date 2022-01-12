import { VALIDATORS, ValidatorResult, AsyncValidatorResult } from '../types';
import required from './required';
import min from './min';
import max from './max';
import minLength from './minLength';
import maxLength from './maxLength';
import email from './email';
import url from './url';
import pattern from './pattern';
import func from './func';

/* eslint-disable @typescript-eslint/ban-ts-comment */
function getValidator(name: string): (...args: unknown[]) => ValidatorResult | AsyncValidatorResult {
	switch (name) {
	case VALIDATORS.required:
		// @ts-ignore
		return required;
	case VALIDATORS.min:
		// @ts-ignore
		return min;
	case VALIDATORS.max:
		// @ts-ignore
		return max;
	case VALIDATORS.minLength:
		// @ts-ignore
		return minLength;
	case VALIDATORS.maxLength:
		// @ts-ignore
		return maxLength;
	case VALIDATORS.email:
		// @ts-ignore
		return email;
	case VALIDATORS.url:
		// @ts-ignore
		return url;
	case VALIDATORS.pattern:
		// @ts-ignore
		return pattern;
	case VALIDATORS.func:
		// @ts-ignore
		return func;
	default:
		return () => {
			throw TypeError(`Validator "${name}" is undefined.`);
		};
	}
}

export default async function validators(name: VALIDATORS, ...args: unknown[]): AsyncValidatorResult {
	const validator = getValidator(name);
	return await validator(...args);
}
/* eslint-enable @typescript-eslint/ban-ts-comment */
