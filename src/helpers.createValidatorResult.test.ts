import { VALIDATION_MESSAGES } from './types';
import { createValidatorResult } from './helpers';

describe('Error', () => {
	test('no messages', () => {
		const result = createValidatorResult(true);

		expect(result).toEqual({ error: true, message: VALIDATION_MESSAGES.fail });
	});

	test('simple fail message', () => {
		const result = createValidatorResult(true, { fail: 'fail message' });

		expect(result).toEqual({ error: true, message: 'fail message' });
	});

	test('simple success message', () => {
		const result = createValidatorResult(true, { success: 'success message' });

		expect(result).toEqual({ error: true, message: VALIDATION_MESSAGES.fail });
	});

	test('both simple messages', () => {
		const result = createValidatorResult(true, { fail: 'fail message', success: 'success message' });

		expect(result).toEqual({ error: true, message: 'fail message' });
	});

	test('functional fail message', () => {
		const fail = jest.fn(() => 'fail message').mockName('fail');

		const result = createValidatorResult(true, { fail });

		expect(result).toEqual({ error: true, message: 'fail message' });
		expect(fail).toBeCalledTimes(1);
		expect(fail).toBeCalledWith();
	});

	test('functional success message', () => {
		const success = jest.fn(() => 'success message').mockName('success');

		const result = createValidatorResult(true, { success });

		expect(result).toEqual({ error: true, message: VALIDATION_MESSAGES.fail });
		expect(success).toBeCalledTimes(0);
	});

	test('both functional messages', () => {
		const fail = jest.fn(() => 'fail message').mockName('fail');
		const success = jest.fn(() => 'success message').mockName('success');

		const result = createValidatorResult(true, { fail, success });

		expect(result).toEqual({ error: true, message: 'fail message' });
		expect(fail).toBeCalledTimes(1);
		expect(fail).toBeCalledWith();
		expect(success).toBeCalledTimes(0);
	});

	test('functional fail message + payload', () => {
		const fail = jest.fn(() => 'fail message').mockName('fail');

		const result = createValidatorResult(true, { fail }, ['message payload 1', 'message payload 2']);

		expect(result).toEqual({ error: true, message: 'fail message' });
		expect(fail).toBeCalledTimes(1);
		expect(fail).toBeCalledWith('message payload 1', 'message payload 2');
	});
});

describe('Valid', () => {
	test('no messages', () => {
		const result = createValidatorResult(false);

		expect(result).toEqual({ error: false, message: VALIDATION_MESSAGES.success });
	});

	test('simple fail message', () => {
		const result = createValidatorResult(false, { fail: 'fail message' });

		expect(result).toEqual({ error: false, message: VALIDATION_MESSAGES.success });
	});

	test('simple success message', () => {
		const result = createValidatorResult(false, { success: 'success message' });

		expect(result).toEqual({ error: false, message: 'success message' });
	});

	test('both simple messages', () => {
		const result = createValidatorResult(false, { fail: 'fail message', success: 'success message' });

		expect(result).toEqual({ error: false, message: 'success message' });
	});

	test('functional fail message', () => {
		const fail = jest.fn(() => 'fail message').mockName('fail');

		const result = createValidatorResult(false, { fail });

		expect(result).toEqual({ error: false, message: VALIDATION_MESSAGES.success });
		expect(fail).toBeCalledTimes(0);
	});

	test('functional success message', () => {
		const success = jest.fn(() => 'success message').mockName('success');

		const result = createValidatorResult(false, { success });

		expect(result).toEqual({ error: false, message: 'success message' });
		expect(success).toBeCalledTimes(1);
		expect(success).toBeCalledWith();
	});

	test('both functional messages', () => {
		const fail = jest.fn(() => 'fail message').mockName('fail');
		const success = jest.fn(() => 'success message').mockName('success');

		const result = createValidatorResult(false, { fail, success });

		expect(result).toEqual({ error: false, message: 'success message' });
		expect(fail).toBeCalledTimes(0);
		expect(success).toBeCalledTimes(1);
		expect(success).toBeCalledWith();
	});

	test('functional success message + payload', () => {
		const success = jest.fn(() => 'success message').mockName('success');

		const result = createValidatorResult(false, { success }, ['message payload 1', 'message payload 2']);

		expect(result).toEqual({ error: false, message: 'success message' });
		expect(success).toBeCalledTimes(1);
		expect(success).toBeCalledWith('message payload 1', 'message payload 2');
	});
});
