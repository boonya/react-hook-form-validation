import aggregator from './index';
import { VALIDATORS } from '../types';
import { mocked } from 'ts-jest/utils';

import required from './required';
import minLength from './minLength';
import maxLength from './maxLength';
import email from './email';
import url from './url';
import pattern from './pattern';
import custom from './custom';

jest.mock('./required');
jest.mock('./minLength');
jest.mock('./maxLength');
jest.mock('./email');
jest.mock('./url');
jest.mock('./pattern');
jest.mock('./custom');

const validators = { required, minLength, maxLength, email, url, pattern, custom };

beforeEach(() => {
	mocked(required).mockName('required').mockReturnValue('required');
	mocked(minLength).mockName('minLength').mockReturnValue('minLength');
	mocked(maxLength).mockName('maxLength').mockReturnValue('maxLength');
	mocked(email).mockName('email').mockReturnValue('email');
	mocked(url).mockName('url').mockReturnValue('url');
	mocked(pattern).mockName('pattern').mockReturnValue('pattern');
	mocked(custom).mockName('custom').mockReturnValue('custom');
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
