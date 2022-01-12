The validator does completely the same as [`min`](#section-min) but opposit.

```js
import {useMemo, useCallback} from 'react';
import useValidation, {VALIDATORS} from 'react-hook-form-validation';

const FIELD_NAME = 'number';

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        {
            validator: VALIDATORS.max,
            expected: 7,
            fail: ({expected}) => `Should'n be greater then ${expected}.`,
            success: ({expected}) => `All good. It's less then ${expected}.`,
        },
    ],
}]);

const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const value = event.target[FIELD_NAME].value;
    await validateForm({[FIELD_NAME]: [value]});
}, [validateForm]);

<form noValidate onSubmit={onSubmit} onReset={resetForm}>
    <label htmlFor="max-number">Enter a number *</label>
    <input
        id="max-number"
        name={FIELD_NAME}
        required
        type="number"
        aria-describedby="max-number-helper-text"
        aria-invalid={validity.isError(FIELD_NAME)}
    />
    <p id="max-number-helper-text">{validity.getMessage(FIELD_NAME)}</p>
    <button type="submit">Validate</button>
    <button type="reset">Reset</button>
</form>
```
