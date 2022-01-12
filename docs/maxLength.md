#### String

```js
import {useMemo, useCallback} from 'react';
import useValidation, {VALIDATORS} from 'react-hook-form-validation';

const FIELD_NAME = 'string';

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        {
            validator: VALIDATORS.max,
            expected: 7,
            fail: ({expected}) => `Should be shorter then ${expected} characters`,
            success: 'All good'
        },
    ],
}]);

const onSubmit = useCallback(async (event) => {
    // Prevent default event to not reload a page
    event.preventDefault();
    /**
     * Extract filed's value and cast it's type to a number.
     * HTML forms always produce a strings.
     */
    const value = event.target[FIELD_NAME].value;
    /**
     * Validate a form.
     * - The value always should be passed as array. It's needed to be able to validate dynamic fields.
     * - `validateForm` & `validateField` functions are asynchronous functions. So, if you need to
     * really know their result, you have to define `await` or `.then(***`.
     */
    await validateForm({[FIELD_NAME]: [value]});
}, [validateForm]);

<form noValidate onSubmit={onSubmit} onReset={resetForm}>
    <label htmlFor="max-string">Enter a string *</label>
    <input
        id="max-string"
        name={FIELD_NAME}
        required
        aria-describedby="max-string-helper-text"
        aria-invalid={validity.isError(FIELD_NAME)}
    />
    <p id="max-string-helper-text">{validity.getMessage(FIELD_NAME)}</p>
    <button type="submit">Validate</button>
    <button type="reset">Reset</button>
</form>
```

#### Array

```js
import {useMemo, useCallback} from 'react';
import useValidation, {VALIDATORS} from 'react-hook-form-validation';

const FIELD_NAME = 'array';

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        {
            validator: VALIDATORS.max,
            expected: 2,
            fail: ({expected}) => `Choose not more than ${expected}`,
            success: 'All good'
        },
    ],
}]);

const onSubmit = useCallback(async (event) => {
    // Prevent default event to not reload a page
    event.preventDefault();
    // Extract filed's value
    const fieldset = event.target[FIELD_NAME];
    const value = Array.from(fieldset.values())
        .filter(({checked}) => checked)
        .map(({value}) => value);
    /**
     * Validate a form.
     * - The value always should be passed as array. It's needed to be able to validate dynamic fields.
     * - `validateForm` & `validateField` functions are asynchronous functions. So, if you need to
     * really know their result, you have to define `await` or `.then(***`.
     */
    await validateForm({[FIELD_NAME]: [value]});
}, [validateForm]);

<form noValidate onSubmit={onSubmit} onReset={resetForm}>
    <fieldset>
        <legend>Choose at least something *</legend>
        <input type="checkbox" id="max-array-1" name={FIELD_NAME} value="1" />
        <label htmlFor="max-array-1">Something #1</label>
        <input type="checkbox" id="max-array-2" name={FIELD_NAME} value="2" />
        <label htmlFor="max-array-2">Something #2</label>
        <input type="checkbox" id="max-array-3" name={FIELD_NAME} value="3" />
        <label htmlFor="max-array-3">Something #3</label>
        <input type="checkbox" id="max-array-4" name={FIELD_NAME} value="4" />
        <label htmlFor="max-array-4">Something #4</label>
        <input type="checkbox" id="max-array-5" name={FIELD_NAME} value="5" />
        <label htmlFor="max-array-5">Something #5</label>
    </fieldset>
    <p id="helper-text">{validity.getMessage(FIELD_NAME)}</p>
    <button type="submit">Validate</button>
    <button type="reset">Reset</button>
</form>
```
