import aggregator from './index';
import { VALIDATORS } from '../types';
import required from './required';
import min from './min';
import max from './max';
import email from './email';
import url from './url';
import pattern from './pattern';
import func from './func';

jest.mock('./required');
jest.mock('./min');
jest.mock('./max');
jest.mock('./email');
jest.mock('./url');
jest.mock('./pattern');
jest.mock('./func');

const validators = { required, min, max, email, url, pattern, func };

beforeEach(() => {
	jest.mocked(required).mockName(VALIDATORS.required).mockReturnValue(VALIDATORS.required);
	jest.mocked(min).mockName(VALIDATORS.min).mockReturnValue(VALIDATORS.min);
	jest.mocked(max).mockName(VALIDATORS.max).mockReturnValue(VALIDATORS.max);
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
