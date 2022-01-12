import aggregator from './index';
import { VALIDATORS } from '../types';
import {isValid as required} from './required';
import {isValid as min} from './min';
import {isValid as max} from './max';
import {isValid as minLength} from './minLength';
import {isValid as maxLength} from './maxLength';
import {isValid as email} from './email';
import {isValid as url} from './url';
import {isValid as pattern} from './pattern';
import {isValid as func} from './func';

jest.mock('./required');
jest.mock('./min');
jest.mock('./max');
jest.mock('./minLength');
jest.mock('./maxLength');
jest.mock('./email');
jest.mock('./url');
jest.mock('./pattern');
jest.mock('./func');

const validators = { required, min, max, minLength, maxLength, email, url, pattern, func };

beforeEach(() => {
	jest.mocked(required).mockName(VALIDATORS.required).mockReturnValue(VALIDATORS.required);
	jest.mocked(min).mockName(VALIDATORS.min).mockReturnValue(VALIDATORS.min);
	jest.mocked(max).mockName(VALIDATORS.max).mockReturnValue(VALIDATORS.max);
	jest.mocked(minLength).mockName(VALIDATORS.minLength).mockReturnValue(VALIDATORS.minLength);
	jest.mocked(maxLength).mockName(VALIDATORS.maxLength).mockReturnValue(VALIDATORS.maxLength);
	jest.mocked(email).mockName(VALIDATORS.email).mockReturnValue(VALIDATORS.email);
	jest.mocked(url).mockName(VALIDATORS.url).mockReturnValue(VALIDATORS.url);
	jest.mocked(pattern).mockName(VALIDATORS.pattern).mockReturnValue(VALIDATORS.pattern);
	jest.mocked(func).mockName(VALIDATORS.func).mockResolvedValue(VALIDATORS.func);
});

Object.values(VALIDATORS).forEach((name) => {
	it(`Existent validator "${name}" returns promise`, async () => {
		const result = await aggregator(name, 'arg1', 'arg2');

		expect(validators[name]).toBeCalledTimes(1);
		expect(validators[name]).toBeCalledWith('arg1', 'arg2');
		expect(result).toBe(name);
	});
});

it('In case unknown validator return rejected promise', async () => {
	await expect(aggregator('unknown', 'arg1', 'arg2')).rejects.toThrow(new TypeError('Validator "unknown" is undefined.'));

	Object.values(validators).forEach((validator) => {
		expect(validator).toBeCalledTimes(0);
	});
});
