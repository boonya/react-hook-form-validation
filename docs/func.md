```js
import {useMemo, useCallback} from 'react';
import useValidation, {VALIDATORS} from 'react-hook-form-validation';

const FIELD_NAME = 'even-number';

function isEven(input) {
    const value = Number(input);
    return !Number.isNaN(value) && value % 2 === 0;
}

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        {
            validator: VALIDATORS.func,
            func: isEven,
            fail: 'This is not an even number.',
            success: 'All good',
        }
    ],
}]);

const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const value = event.target[FIELD_NAME].value;
    await validateForm({[FIELD_NAME]: [value]});
}, [validateForm]);

<form noValidate onSubmit={onSubmit} onReset={resetForm}>
    <label htmlFor={FIELD_NAME}>Enter an even number</label>
    <input
        id={FIELD_NAME}
        name={FIELD_NAME}
        required
        aria-invalid={validity.isError(FIELD_NAME)}
    />
    <p>{validity.getMessage(FIELD_NAME)}</p>
    <button type="submit">Validate</button>
    <button type="reset">Reset</button>
</form>
```

Sometimes you may need to print something more specific rather than just "valid" or "invalid". For that purpose you may return an array from your function. Where the first element should be a sign of validity, and the rest will be proxied into the message builder function.

```js
import {useMemo, useCallback} from 'react';
import useValidation, {VALIDATORS} from 'react-hook-form-validation';

const FIELD_NAME = 'fruit';

function guessFruit(input) {
    if (typeof input !== 'string') {
        return false;
    }
    const FRUITS = ['apple', 'banana', 'kiwi'];
    if (FRUITS.includes(input.toLowerCase())) {
        return true;
    }
    return [false, ...FRUITS];
}

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        {
            validator: VALIDATORS.func,
            func: guessFruit,
            fail: ({input, payload}) => `Guessed wrong. It should have been ${payload.join(', ')}.`,
            success: 'Correct',
        }
    ],
}]);

const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const value = event.target[FIELD_NAME].value;
    await validateForm({[FIELD_NAME]: [value]});
}, [validateForm]);

<form noValidate onSubmit={onSubmit} onReset={resetForm}>
    <label htmlFor={FIELD_NAME}>Guess fruit</label>
    <input
        id={FIELD_NAME}
        name={FIELD_NAME}
        required
        aria-invalid={validity.isError(FIELD_NAME)}
    />
    <p>{validity.getMessage(FIELD_NAME)}</p>
    <button type="submit">Validate</button>
    <button type="reset">Reset</button>
</form>
```
