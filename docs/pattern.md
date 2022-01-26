```js
import {useMemo, useCallback} from 'react';
import useValidation, {validatePattern} from 'react-hook-form-validation';

const FIELD_NAME = 'postal-code';

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        validatePattern(/^(?!.*[DFIOQU])[A-VXY]\d[A-Z]\s?\d[A-Z]\d$/ui, {
            fail: 'This is not a valid one.',
            success: 'All good',
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
        id="postal-code"
        name={FIELD_NAME}
        label="Enter a canadian postal code"
        required
        aria-invalid={validity.isPristine(FIELD_NAME) ? undefined : validity.isError(FIELD_NAME)}
        description={validity.getMessage(FIELD_NAME)}
    />
    <Button type="submit">Validate</Button>
    <Button type="reset">Reset</Button>
</Form>
```
