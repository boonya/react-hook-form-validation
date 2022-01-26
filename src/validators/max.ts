import { VALIDATION_MESSAGES, ValidatorLengthParams, MinMaxValue, ValidatorResult, ValidatorCommonParams, VALIDATORS, MinMaxMode } from '../types';
import { createValidatorResult } from '../helpers';

export default function create(expected: number, mode: MinMaxMode = 'number', props: ValidatorCommonParams = {}) {
	return { validator: VALIDATORS.max, expected, mode, ...props };
}

function compareNumbers(value: number, expected: number) {
	return !Number.isNaN(value) && value <= expected;
}

function verifyNumber(input: MinMaxValue, expected: number) {
	const number = Number(input);
	const valid = input === undefined || input === '' || compareNumbers(number, expected);
	return { valid, actual: number };
}

function verifyLength(input: MinMaxValue, expected: number) {
	try {
		const length = [...input].length;
		const valid = length <= expected;
		return { valid, actual: length };
	}
	catch {
		return { valid: false, actual: undefined };
	}
}

export function isValid(input: MinMaxValue, { expected, mode, ...messages }: ValidatorLengthParams): ValidatorResult {
	const { valid, actual } = mode === 'length'
		? verifyLength(input, expected)
		: verifyNumber(input, expected);

	return createValidatorResult(
		valid,
		{ fail: VALIDATION_MESSAGES.max, ...messages },
		[{ expected, actual }]
	);
}
