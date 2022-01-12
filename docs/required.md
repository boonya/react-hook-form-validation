The validator will skip any numbers, such as positive negative and non-integers.
After that, it checks if it is a string. If so, then it trims the extra spaces from the edges, if any,
and checks if it is an empty string. If so, the check has failed.
If it is not a number or a string, the validator will use the [lodash/isEmpty](https://lodash.com/docs/4.17.15#isEmpty) logic.

> Checks if value is an empty object, collection, map, or set.
>
> Objects are considered empty if they have no own enumerable string keyed properties.
>
> Array-like values such as arguments objects, arrays, buffers, strings, or jQuery-like collections are considered empty if they have a length of 0. Similarly, maps and sets are considered empty if they have a size of 0.

#### Number

```js
import {useMemo, useCallback} from 'react';
import useValidation, {VALIDATORS} from 'react-hook-form-validation';

const FIELD_NAME = 'number';

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        {validator: VALIDATORS.required, fail: 'The field is required', success: 'All good'},
    ],
}]);

const onSubmit = useCallback(async (event) => {
    // Prevent default event to not reload a page
    event.preventDefault();
    /**
     * Extract filed's value and cast it's type to a number.
     * HTML forms always produce a strings.
     */
    const value = Number(event.target[FIELD_NAME].value);
    /**
     * Validate a form.
     * - The value always should be passed as array. It's needed to be able to validate dynamic fields.
     * - `validateForm` & `validateField` functions are asynchronous functions. So, if you need to
     * really know their result, you have to define `await` or `.then(***`.
     */
    await validateForm({[FIELD_NAME]: [value]});
}, [validateForm]);

<form noValidate onSubmit={onSubmit} onReset={resetForm}>
    <label htmlFor="required-number">Enter a number *</label>
    <input
        id="required-number"
        name={FIELD_NAME}
        required
        type="number"
        aria-describedby="required-number-helper-text"
        aria-invalid={validity.isError(FIELD_NAME)}
    />
    <p id="required-number-helper-text">{validity.getMessage(FIELD_NAME)}</p>
    <button type="submit">Validate</button>
    <button type="reset">Reset</button>
</form>
```

#### String

```js
import {useMemo, useCallback} from 'react';
import useValidation, {VALIDATORS} from 'react-hook-form-validation';

const FIELD_NAME = 'string';

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        {validator: VALIDATORS.required, fail: 'The field is required', success: 'All good'},
    ],
}]);

const onSubmit = useCallback(async (event) => {
    // Prevent default event to not reload a page
    event.preventDefault();
    // Extract filed's value
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
    <label htmlFor="required-string">Enter a string *</label>
    <input
        id="required-string"
        name={FIELD_NAME}
        required
        aria-describedby="required-string-helper-text"
        aria-invalid={validity.isError(FIELD_NAME)}
    />
    <p id="required-string-helper-text">{validity.getMessage(FIELD_NAME)}</p>
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
        {validator: VALIDATORS.required, fail: 'The field is required', success: 'All good'},
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
        <input type="checkbox" id="required-array-1" name={FIELD_NAME} value="1" />
        <label htmlFor="required-array-1">Something #1</label>
        <input type="checkbox" id="required-array-2" name={FIELD_NAME} value="2" />
        <label htmlFor="required-array-2">Something #2</label>
        <input type="checkbox" id="required-array-3" name={FIELD_NAME} value="3" />
        <label htmlFor="required-array-3">Something #3</label>
    </fieldset>
    <p>{validity.getMessage(FIELD_NAME)}</p>
    <button type="submit">Validate</button>
    <button type="reset">Reset</button>
</form>
```
