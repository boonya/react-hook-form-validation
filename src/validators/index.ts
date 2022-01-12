import { VALIDATORS, ValidatorResult, AsyncValidatorResult } from '../types';
import {isValid as required} from './required';
import {isValid as min} from './min';
import {isValid as max} from './max';
import {isValid as minLength} from './minLength';
import {isValid as maxLength} from './maxLength';
import {isValid as email} from './email';
import {isValid as url} from './url';
import {isValid as pattern} from './pattern';
import {isValid as func} from './func';

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
	const isValid = getValidator(name);
	return await isValid(...args);
}
/* eslint-enable @typescript-eslint/ban-ts-comment */
