import { VALIDATORS, ValidatorResult, AsyncValidatorResult } from '../types';
import required from './required';
import min from './min';
import max from './max';
import email from './email';
import url from './url';
import postalCodeCA from './postalCode-CA';
import sinCA from './sin-CA';
import pattern from './pattern';
import func from './func';
import async from './async';

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
	case VALIDATORS.email:
		// @ts-ignore
		return email;
	case VALIDATORS.url:
		// @ts-ignore
		return url;
	case VALIDATORS.postalCodeCA:
		// @ts-ignore
		return postalCodeCA;
	case VALIDATORS.sinCA:
		// @ts-ignore
		return sinCA;
	case VALIDATORS.pattern:
		// @ts-ignore
		return pattern;
	case VALIDATORS.func:
		// @ts-ignore
		return func;
	case VALIDATORS.async:
		// @ts-ignore
		return async;
	default:
		return () => {
			throw TypeError(`Validator "${name}" is undefined.`);
		};
	}
}

export default async function validators(name: VALIDATORS, ...args: unknown[]): AsyncValidatorResult {
	const validator = getValidator(name);
	if (name !== VALIDATORS.async) {
		return await validator(...args);
	}
	return validator(...args);
}
/* eslint-enable @typescript-eslint/ban-ts-comment */
