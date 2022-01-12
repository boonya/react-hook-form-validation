The validator tries to cast a string to a number if possible and compares actual number with expected.

```js
import {useMemo, useCallback} from 'react';
import useValidation, {VALIDATORS} from 'react-hook-form-validation';

const FIELD_NAME = 'number';

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        {
            validator: VALIDATORS.min,
            expected: 12,
            fail: ({expected}) => `Should'n be less then ${expected}.`,
            success: ({expected}) => `All good. It's bigger then ${expected}.`,
        },
    ],
}]);

const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const value = event.target[FIELD_NAME].value;
    await validateForm({[FIELD_NAME]: [value]});
}, [validateForm]);

<form noValidate onSubmit={onSubmit} onReset={resetForm}>
    <label htmlFor="min-number">Enter a number *</label>
    <input
        id="min-number"
        name={FIELD_NAME}
        required
        type="number"
        aria-describedby="min-number-helper-text"
        aria-invalid={validity.isError(FIELD_NAME)}
    />
    <p id="min-number-helper-text">{validity.getMessage(FIELD_NAME)}</p>
    <button type="submit">Validate</button>
    <button type="reset">Reset</button>
</form>
```
