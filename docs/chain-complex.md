#### Here you can check how validators chain works.

- The first is to check for the presence of a value. "Required" in other words.
- The second validates that the value is a number
- The third and fourth validators are "min" and "max".

```js
import {useMemo, useCallback} from 'react';
import useValidation, {VALIDATORS} from 'react-hook-form-validation';

const FIELD_NAME = 'number';

function isNumber(input) {
    const value = input.trim();
    if (value === '') {
        return false;
    }
    return Number.isSafeInteger(Number(value));
}

const {validity, validateForm, resetForm} = useValidation([{
    // The name of a field we want to validate by validators chain defined below
    field: FIELD_NAME,
    rules: [
        // Here we defined required validator with custom onFail message.
        {validator: VALIDATORS.required, fail: 'The field is required'},
        // We want to check that a value is an integer (number)
        {validator: VALIDATORS.func, func: isNumber, fail: 'Not a number'},
        // Validate that a value not less than 5
        {validator: VALIDATORS.min, expected: 5, castType: Number, fail: ({expected}) => `The value is less than ${expected}`},
        // Validate that a value not greater than 41
        {validator: VALIDATORS.max, expected: 41, castType: Number, fail: ({expected}) => `The value is more than ${expected}`},
    ],
}]);

const onSubmit = useCallback(async (event) => {
    // Preventing default event to not reload a page
    event.preventDefault();
    try {
        const {value} = event.target.number;
        /**
         * validateForm & validateField functions always return a Promise,
         * so if you need to wait result you have to use `await` or `then`.
         *
         * A value have to be passed as an array. It's needed to be able to validate dynamic forms
         * with more than one field with the same name.
         */
        await validateForm({[FIELD_NAME]: [value]});
    } catch (err) {
        /**
         * In case of async validator you may need to catch a possible error.
         * Here is an example of how you may do that.
         */
        console.error(err);
        alert('Something went wrong');
    }
}, [validateForm]);

const FormStatus = useCallback(({isPristine, isValid}) => {
    if (isPristine) {
        return null;
    }
    const text = isValid ? "The form is valid" : "The form is invalid";
    return <p id="form-status">{text}</p>
}, []);

<form noValidate onSubmit={onSubmit} onReset={resetForm} aria-describedby="form-status">
    <label htmlFor="number-input">Enter a number *</label>
    <input
        id="number-input"
        name={FIELD_NAME}
        required
        type="number"
        aria-describedby="helper-text"
        aria-invalid={validity.isError(FIELD_NAME)}
    />
    <p id="helper-text">{validity.getMessage(FIELD_NAME)}</p>
    <button type="submit">Validate</button>
    <button type="reset">Reset</button>
    <FormStatus isPristine={validity.isPristine()} isValid={validity.isValid()} />
</form>
```
