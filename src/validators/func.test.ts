import validateValue from './func';
import { createValidatorResult } from '../helpers';


jest.mock('../helpers');

beforeEach(() => {
	jest.mocked(createValidatorResult).mockName('createValidatorResult')
		.mockImplementation((error) => ({ error, message: 'message' }));
});

describe('Error', () => {
	describe('Sync function', () => {
		it('function returns false', async () => {
			const func = jest.fn().mockName('func').mockReturnValueOnce(false);

			const result = await validateValue('value', { func });

			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(true, {}, []);
			expect(result).toEqual({ error: true, message: 'message' });
		});

		it('function returns [false, "value 1", "value 2"]', async () => {
			const func = jest.fn().mockName('func').mockReturnValue([false, 'value 1', 'value 2']);

			const result = await validateValue('value', { func });

			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(true, {}, ['value 1', 'value 2']);
			expect(result).toEqual({ error: true, message: 'message' });
		});

		it('custom error message', async () => {
			const func = jest.fn().mockName('func').mockReturnValueOnce(false);

			const result = await validateValue('value', { func, fail: 'Custom error' });

			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(true, { fail: 'Custom error' }, []);
			expect(result).toEqual({ error: true, message: 'message' });
		});
	});

	describe('Async function', () => {
		it('function resolves false', async () => {
			const func = jest.fn().mockName('func').mockResolvedValue(false);

			const result = await validateValue('value', { func });

			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(true, {}, []);
			expect(result).toEqual({ error: true, message: 'message' });
		});

		it('function resolves [false, "value 1", "value 2"]', async () => {
			const func = jest.fn().mockName('func').mockResolvedValue([false, 'value 1', 'value 2']);

			const result = await validateValue('value', { func });

			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(true, {}, ['value 1', 'value 2']);
			expect(result).toEqual({ error: true, message: 'message' });
		});

		it('custom error message', async () => {
			const func = jest.fn().mockName('func').mockResolvedValue(false);

			const result = await validateValue('value', { func, fail: 'Custom error' });

			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(true, { fail: 'Custom error' }, []);
			expect(result).toEqual({ error: true, message: 'message' });
		});
	});
});

describe('Valid', () => {
	describe('Sync function', () => {
		it('function returns true', async () => {
			const func = jest.fn().mockName('func').mockReturnValueOnce(true);

			const result = await validateValue('value', { func });

			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(false, {}, []);
			expect(result).toEqual({ error: false, message: 'message' });
		});

		it('function returns [true, "value 1", "value 2"]', async () => {
			const func = jest.fn().mockName('func').mockReturnValue([true, 'value 1', 'value 2']);

			const result = await validateValue('value', { func });

			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(false, {}, ['value 1', 'value 2']);
			expect(result).toEqual({ error: false, message: 'message' });
		});
	});

	describe('Async function', () => {
		it('function resolves true', async () => {
			const func = jest.fn().mockName('func').mockResolvedValue(true);

			const result = await validateValue('value', { func });

			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(false, {}, []);
			expect(result).toEqual({ error: false, message: 'message' });
		});

		it('function resolves [true, "value 1", "value 2"]', async () => {
			const func = jest.fn().mockName('func').mockResolvedValue([true, 'value 1', 'value 2']);

			const result = await validateValue('value', { func });

			expect(createValidatorResult).toBeCalledTimes(1);
			expect(createValidatorResult).toBeCalledWith(false, {}, ['value 1', 'value 2']);
			expect(result).toEqual({ error: false, message: 'message' });
		});
	});
});

describe('Exception', () => {
	describe('Sync function', () => {
		it('function throws an error', async () => {
			const func = jest.fn(() => {
				throw new Error('An error');
			}).mockName('func');

			await expect(validateValue('value', { func })).rejects.toThrowError(new Error('An error'));
		});

		it('function returns unexpected value', async () => {
			const func = jest.fn().mockName('func').mockReturnValue('unexpected value');

			await expect(validateValue('value', { func })).rejects.toThrowError(new TypeError('Your function returned unexpected value'));
			expect(createValidatorResult).toBeCalledTimes(0);
		});
	});

	describe('Async function', () => {
		it('function rejects promise', async () => {
			const func = jest.fn().mockName('func').mockRejectedValue(new Error('An error'));

			await expect(validateValue('value', { func })).rejects.toThrowError(new Error('An error'));
		});

		it('function resolves unexpected value', async () => {
			const func = jest.fn().mockName('func').mockResolvedValue('unexpected value');

			await expect(validateValue('value', { func })).rejects.toThrowError(new TypeError('Your function returned unexpected value'));
			expect(createValidatorResult).toBeCalledTimes(0);
		});
	});
});
