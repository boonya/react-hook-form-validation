import create, {isValid} from './func';
import { createValidatorResult } from '../helpers';
import { VALIDATORS } from '../types';

jest.mock('../helpers');

beforeEach(() => {
	jest.mocked(createValidatorResult)
		.mockName('createValidatorResult')
		.mockImplementation((error) => error);
});

describe('Error', () => {
	describe('Sync function', () => {
		it('should reject "false".', async () => {
			const func = jest.fn().mockName('func').mockReturnValueOnce(false);

			const result = await isValid('value', { func });

			expect(result).toBe(false);
			expect(createValidatorResult).toBeCalledWith(
				false,
				{},
				[{ input: 'value', payload: [] }],
			);
			expect(func).toBeCalledTimes(1);
			expect(func).toBeCalledWith('value');
		});

		it('should reject and pass response.', async () => {
			const func = jest.fn().mockName('func').mockReturnValue([false, 'value 1', 'value 2']);

			const result = await isValid('value', { func });

			expect(result).toBe(false);
			expect(createValidatorResult).toBeCalledWith(
				false,
				{},
				[{ input: 'value', payload: ['value 1', 'value 2'] }],
			);
			expect(func).toBeCalledTimes(1);
			expect(func).toBeCalledWith('value');
		});

		it('should rejects and pass custom messages.', async () => {
			const func = jest.fn().mockName('func').mockReturnValueOnce(false);

			const result = await isValid('value', { func, fail: 'Fail', success: 'Success' });

			expect(result).toBe(false);
			expect(createValidatorResult).toBeCalledWith(
				false,
				{ fail: 'Fail', success: 'Success' },
				[{ input: 'value', payload: [] }],
			);
			expect(func).toBeCalledTimes(1);
			expect(func).toBeCalledWith('value');
		});
	});

	describe('Async function', () => {
		it('should reject "Promise.resolved(false)".', async () => {
			const func = jest.fn().mockName('func').mockResolvedValue(false);

			const result = await isValid('value', { func });

			expect(result).toBe(false);
			expect(createValidatorResult).toBeCalledWith(
				false,
				{},
				[{ input: 'value', payload: [] }],
			);
			expect(func).toBeCalledTimes(1);
			expect(func).toBeCalledWith('value');
		});

		it('should reject and pass response.', async () => {
			const func = jest.fn().mockName('func').mockResolvedValue([false, 'value 1', 'value 2']);

			const result = await isValid('value', { func });

			expect(result).toBe(false);
			expect(createValidatorResult).toBeCalledWith(
				false,
				{},
				[{ input: 'value', payload: ['value 1', 'value 2'] }],
			);
			expect(func).toBeCalledTimes(1);
			expect(func).toBeCalledWith('value');
		});

		it('should rejects and pass custom messages.', async () => {
			const func = jest.fn().mockName('func').mockResolvedValue(false);

			const result = await isValid('value', { func, fail: 'Fail', success: 'Success' });

			expect(result).toBe(false);
			expect(createValidatorResult).toBeCalledWith(
				false,
				{ fail: 'Fail', success: 'Success' },
				[{ input: 'value', payload: [] }],
			);
			expect(func).toBeCalledTimes(1);
			expect(func).toBeCalledWith('value');
		});
	});
});

describe('Valid', () => {
	describe('Sync function', () => {
		it('should accept "true".', async () => {
			const func = jest.fn().mockName('func').mockReturnValue(true);

			const result = await isValid('value', { func });

			expect(result).toBe(true);
			expect(createValidatorResult).toBeCalledWith(
				true,
				{},
				[{ input: 'value', payload: [] }]
			);
			expect(func).toBeCalledTimes(1);
			expect(func).toBeCalledWith('value');
		});

		it('should accept and pass response.', async () => {
			const func = jest.fn().mockName('func').mockReturnValue([true, 'value 1', 'value 2']);

			const result = await isValid('value', { func });

			expect(result).toBe(true);
			expect(createValidatorResult).toBeCalledWith(
				true,
				{},
				[{ input: 'value', payload: ['value 1', 'value 2'] }]
			);
			expect(func).toBeCalledTimes(1);
			expect(func).toBeCalledWith('value');
		});
	});

	describe('Async function', () => {
		it('should accept "Promise.resolved(true)".', async () => {
			const func = jest.fn().mockName('func').mockResolvedValue(true);

			const result = await isValid('value', { func });

			expect(result).toBe(true);
			expect(createValidatorResult).toBeCalledWith(
				true,
				{},
				[{ input: 'value', payload: [] }],
			);
			expect(func).toBeCalledTimes(1);
			expect(func).toBeCalledWith('value');
		});

		it('should accept and pass response.', async () => {
			const func = jest.fn().mockName('func').mockResolvedValue([true, 'value 1', 'value 2']);

			const result = await isValid('value', { func });

			expect(result).toBe(true);
			expect(createValidatorResult).toBeCalledWith(
				true,
				{},
				[{ input: 'value', payload: ['value 1', 'value 2'] }],
			);
			expect(func).toBeCalledTimes(1);
			expect(func).toBeCalledWith('value');
		});
	});
});

describe('Exception', () => {
	describe('Sync function', () => {
		it('function throws an error', async () => {
			const func = jest.fn(() => {
				throw new Error('An error');
			}).mockName('func');

			await expect(isValid('value', { func })).rejects.toThrowError(new Error('An error'));
		});

		it('function returns unexpected value', async () => {
			const func = jest.fn().mockName('func').mockReturnValue('unexpected value');

			await expect(isValid('value', { func })).rejects.toThrowError(new TypeError('Your function returned unexpected value'));
			expect(createValidatorResult).toBeCalledTimes(0);
		});
	});

	describe('Async function', () => {
		it('function rejects promise', async () => {
			const func = jest.fn().mockName('func').mockRejectedValue(new Error('An error'));

			await expect(isValid('value', { func })).rejects.toThrowError(new Error('An error'));
		});

		it('function resolves unexpected value', async () => {
			const func = jest.fn().mockName('func').mockResolvedValue('unexpected value');

			await expect(isValid('value', { func })).rejects.toThrowError(new TypeError('Your function returned unexpected value'));
			expect(createValidatorResult).toBeCalledTimes(0);
		});
	});
});

describe('validator definition object creator', () => {
	it('should return basic validator definition object.', () => {
		const myFunc = () => true;
		const object = create(myFunc);

		expect(object).toEqual({validator: VALIDATORS.func, func: myFunc});
	});

	it('should return extended validator definition object.', () => {
		const myFunc = () => true;
		const object = create(myFunc, {fail: 'Fail', success: 'Success'});

		expect(object).toEqual({validator: VALIDATORS.func, func: myFunc, fail: 'Fail', success: 'Success'});
	});
});
