import { VALIDATORS } from '../types';
import required from './required';
import minLength from './minLength';
import maxLength from './maxLength';
import email from './email';
import url from './url';
import pattern from './pattern';
import custom from './custom';

/* eslint-disable @typescript-eslint/ban-ts-comment */
export default function validators(validator: VALIDATORS, ...args: unknown[]): string|null {
	switch (validator) {
	case VALIDATORS.required:
		// @ts-ignore
		return required(...args);
	case VALIDATORS.minLength:
		// @ts-ignore
		return minLength(...args);
	case VALIDATORS.maxLength:
		// @ts-ignore
		return maxLength(...args);
	case VALIDATORS.email:
		// @ts-ignore
		return email(...args);
	case VALIDATORS.url:
		// @ts-ignore
		return url(...args);
	case VALIDATORS.pattern:
		// @ts-ignore
		return pattern(...args);
	case VALIDATORS.custom:
		// @ts-ignore
		return custom(...args);
	default:
		throw TypeError(`Validator "${validator}" is undefined.`);
	}
}
/* eslint-enable @typescript-eslint/ban-ts-comment */
