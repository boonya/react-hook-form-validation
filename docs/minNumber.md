The validator tries to cast a string to a number if possible and compares actual number with expected.

```js
import {useMemo, useCallback} from 'react';
import useValidation, {validateMin} from 'react-hook-form-validation';

const FIELD_NAME = 'number';

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        validateMin(12, 'number', {
            fail: ({expected}) => `Should'n be less then ${expected}.`,
            success: 'All good.',
        })
    ],
}]);

const onSubmit = useCallback(async (event) => {
    console.log(event, event.target)
    event.preventDefault();
    const value = event.target[FIELD_NAME].value;
    await validateForm({[FIELD_NAME]: [value]});
}, [validateForm]);

<Form onSubmit={onSubmit} onReset={resetForm}>
    <Input
        id="min-number"
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
