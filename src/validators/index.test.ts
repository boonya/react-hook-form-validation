import aggregator from './index';
import { VALIDATORS } from '../types';
import { mocked } from 'ts-jest/utils';

import required from './required';
import min from './min';
import max from './max';
import email from './email';
import url from './url';
import postalCodeCA from './postalCode-CA';
import sinCA from './sin-CA';
import pattern from './pattern';
import func from './func';

jest.mock('./required');
jest.mock('./min');
jest.mock('./max');
jest.mock('./email');
jest.mock('./url');
jest.mock('./postalCode-CA');
jest.mock('./sin-CA');
jest.mock('./pattern');
jest.mock('./func');

const validators = { required, min, max, email, url, postalCodeCA, sinCA, pattern, func };

beforeEach(() => {
	mocked(required).mockName('required').mockReturnValue('required');
	mocked(min).mockName('min').mockReturnValue('min');
	mocked(max).mockName('max').mockReturnValue('max');
	mocked(email).mockName('email').mockReturnValue('email');
	mocked(url).mockName('url').mockReturnValue('url');
	mocked(postalCodeCA).mockName('postalCodeCA').mockReturnValue('postalCodeCA');
	mocked(sinCA).mockName('sinCA').mockReturnValue('sinCA');
	mocked(pattern).mockName('pattern').mockReturnValue('pattern');
	mocked(func).mockName('func').mockReturnValue('func');
});

Object.values(VALIDATORS).forEach((name) => {
	it(`Existent validator "${name}" called`, () => {
		const result = aggregator(name, 'arg1', 'arg2');

		expect(validators[name]).toBeCalledTimes(1);
		expect(validators[name]).toBeCalledWith('arg1', 'arg2');
		expect(result).toBe(name);
	});
});

it('Unknown validator called', () => {
	expect(() => aggregator('unknown', 'arg1', 'arg2')).toThrow(new TypeError('Validator "unknown" is undefined.'));
	Object.values(validators).forEach((validator) => {
		expect(validator).toBeCalledTimes(0);
	});
});
