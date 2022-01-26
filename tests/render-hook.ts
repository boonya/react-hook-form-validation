import useHook from '../src/index';
import { ValidationRuleSet } from '../src/types';
import Validity from '../src/validity';
import { renderHook } from '@testing-library/react-hooks';

export default function (validRuleSet: ValidationRuleSet) {
	const { result } = renderHook(() => useHook(validRuleSet));
	return result;
}

export { act } from '@testing-library/react-hooks';

// TODO: Deal with custom error message.
expect.extend({
	isValidityObject(received, array) {
		const expected = new Validity(array);
		const pass = this.equals(received, expected);
		if (pass) {
			return { message: () => '', pass };
		}
		return {
			message: () => `expected ${received.toString()} to be same as ${{ ...expected }.toString()}.`,
			pass,
		};
	}
});
