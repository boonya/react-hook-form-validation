import {VALIDATION_MESSAGES, ValidatorLengthParams, LengthValue, ValidatorResult} from '../types';
import {createValidatorResult} from '../helpers';

export default function maxLength(input: LengthValue, {expected, ...messages}: ValidatorLengthParams): ValidatorResult {
	let actual;
	let error;
	try {
		actual = [...input].length;
		error = actual > expected;
	}
	catch {
		error = true;
	}

	return createValidatorResult(
		error,
		{fail: VALIDATION_MESSAGES.maxLength, ...messages},
		[{ expected, actual }]
	);
}
