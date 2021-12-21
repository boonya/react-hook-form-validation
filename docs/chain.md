#### Here you can check how validators chain works.

The first is to check for the presence of a value. "Required" in other words.

The second and third validators are "min" and "max". If these functions return "true" that means a value is valid.

So, second validator checks whether your input not less than 5.

The third one checks whether it maximum 15.

```js
import {useMemo, useCallback} from 'react';
import useValidation, {VALIDATORS} from 'react-hook-form-validation';

const FILED_NAME = 'number';

const {validity, validateForm, resetForm} = useValidation([{
    field: FILED_NAME,
    rules: [
        {validator: VALIDATORS.required, fail: 'The field is required'},
        {validator: VALIDATORS.func, func: Number.isInteger, fail: 'Not a number'},
        {validator: VALIDATORS.min, expected: 5, fail: ({expected}) => `The value is less than ${expected}`},
        {validator: VALIDATORS.max, expected: 15, fail: ({expected}) => `The value is more than ${expected}`},
    ],
}]);

const isPristine = validity.isPristine();
const isError = validity.isError(FILED_NAME);
const errorMessage = validity.getMessage(FILED_NAME);

const feedback = useMemo(() => {
    if (isPristine) {
        return null;
    }
    if (isError) {
        return <p>{errorMessage}</p>;
    }
    return <p>Valid</p>;
}, [isPristine, isError, errorMessage]);

const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const value = Number(event.target[FILED_NAME].value);
    await validateForm({[FILED_NAME]: [value]});
}, [validateForm]);

<form onSubmit={onSubmit} onReset={resetForm}>
    <label htmlFor="number">Number from 5 to 15</label>
    <input name="number" required />
    <button type="submit">Validate</button>
    <button type="reset">Reset</button>
    {feedback}
</form>
```
