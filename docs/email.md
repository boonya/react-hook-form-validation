```js
import {useMemo, useCallback} from 'react';
import useValidation, {VALIDATORS} from 'react-hook-form-validation';

const FIELD_NAME = 'email';

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        {
            validator: VALIDATORS.email,
            fail: 'The value is not similar to an email address',
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
    <label htmlFor="required-string">Enter an email *</label>
    <input
        id="email-string"
        name={FIELD_NAME}
        required
        aria-invalid={validity.isError(FIELD_NAME)}
    />
    <p>{validity.getMessage(FIELD_NAME)}</p>
    <button type="submit">Validate</button>
    <button type="reset">Reset</button>
</form>
```
