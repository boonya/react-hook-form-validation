#### String

```js
import {useMemo, useCallback} from 'react';
import useValidation, {validateMax} from 'react-hook-form-validation';

const FIELD_NAME = 'string';

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        validateMax(7, 'length', {
            fail: ({expected}) => `Should be shorter then ${expected} characters`,
            success: 'All good'
        }),
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

<Form onSubmit={onSubmit} onReset={resetForm}>
    <Input
        id="max-length-string"
        label="Enter a string"
        name={FIELD_NAME}
        aria-invalid={validity.isPristine(FIELD_NAME) ? undefined : validity.isError(FIELD_NAME)}
        description={validity.getMessage(FIELD_NAME)}
    />
    <Button type="submit">Validate</Button>
    <Button type="reset">Reset</Button>
</Form>
```

#### Array

```js
import {useMemo, useCallback} from 'react';
import useValidation, {validateMax} from 'react-hook-form-validation';

const FIELD_NAME = 'array';

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        validateMax(2, 'length', {
            fail: ({expected}) => `Choose not more than ${expected}`,
            success: 'All good'
        }),
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

<Form onSubmit={onSubmit} onReset={resetForm}>
    <Checks
        id="max-length-array"
        label="Choose at least something"
        required
        name={FIELD_NAME}
        items={[
            ['Something #1', 1],
            ['Something #2', 2],
            ['Something #3', 3],
            ['Something #4', 4],
            ['Something #5', 5],
        ]}
        aria-invalid={validity.isPristine(FIELD_NAME) ? undefined : validity.isError(FIELD_NAME)}
        description={validity.getMessage(FIELD_NAME)}
    />
    <Button type="submit">Validate</Button>
    <Button type="reset">Reset</Button>
</Form>
```
