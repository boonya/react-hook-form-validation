The validator does completely the same as [`min`](#section-min) but opposit.

```js
import {useMemo, useCallback} from 'react';
import useValidation, {validateMax} from 'react-hook-form-validation';

const FIELD_NAME = 'number';

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        validateMax(7, 'number', {
            fail: ({expected}) => `Should'n be greater then ${expected}.`,
            success: 'All good.',
        }),
    ],
}]);

const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const value = event.target[FIELD_NAME].value;
    await validateForm({[FIELD_NAME]: [value]});
}, [validateForm]);

<Form onSubmit={onSubmit} onReset={resetForm}>
    <Input
        id="max-number"
        label="Enter a number"
        type="number"
        name={FIELD_NAME}
        aria-invalid={validity.isPristine(FIELD_NAME) ? undefined : validity.isError(FIELD_NAME)}
        description={validity.getMessage(FIELD_NAME)}
    />
    <Button type="submit">Validate</Button>
    <Button type="reset">Reset</Button>
</Form>
```
