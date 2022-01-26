```js
import {useMemo, useCallback} from 'react';
import useValidation, {validateFunc} from 'react-hook-form-validation';

const FIELD_NAME = 'even-number';

function awaitSuccess(value) {
    if (!value.trim()) {
        return false;
    }
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000);
    });
}

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        validateFunc(awaitSuccess, {
            fail: 'Enter at least something',
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
        id="even-number"
        name={FIELD_NAME}
        label="Enter anything an wait result for a second"
        required
        aria-invalid={validity.isPristine(FIELD_NAME) ? undefined : validity.isError(FIELD_NAME)}
        description={validity.getMessage(FIELD_NAME)}
    />
    <Button type="submit">Validate</Button>
    <Button type="reset">Reset</Button>
</Form>
```