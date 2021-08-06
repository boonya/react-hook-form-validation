import { VALIDATORS } from '../types';
import required from './required';
import min from './min';
import max from './max';
import email from './email';
import url from './url';
import postalCodeCA from './postalCode-CA';
import sinCA from './sin-CA';
import pattern from './pattern';
import func from './func';

/* eslint-disable @typescript-eslint/ban-ts-comment */
export default function validators(validator: VALIDATORS, ...args: unknown[]): string|null {
	switch (validator) {
	case VALIDATORS.required:
		// @ts-ignore
		return required(...args);
	case VALIDATORS.min:
		// @ts-ignore
		return min(...args);
	case VALIDATORS.max:
		// @ts-ignore
		return max(...args);
	case VALIDATORS.email:
		// @ts-ignore
		return email(...args);
	case VALIDATORS.url:
		// @ts-ignore
		return url(...args);
	case VALIDATORS.postalCodeCA:
		// @ts-ignore
		return postalCodeCA(...args);
	case VALIDATORS.sinCA:
		// @ts-ignore
		return sinCA(...args);
	case VALIDATORS.pattern:
		// @ts-ignore
		return pattern(...args);
	case VALIDATORS.func:
		// @ts-ignore
		return func(...args);
	default:
		throw TypeError(`Validator "${validator}" is undefined.`);
	}
}
/* eslint-enable @typescript-eslint/ban-ts-comment */
