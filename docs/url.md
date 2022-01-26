```js
import {useMemo, useCallback} from 'react';
import useValidation, {validateUrl} from 'react-hook-form-validation';

const FIELD_NAME = 'url';

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        validateUrl({
            fail: 'The value is not similar to a URL',
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
        id="url-string"
        name={FIELD_NAME}
        label="Enter a URL"
        required
        aria-invalid={validity.isPristine(FIELD_NAME) ? undefined : validity.isError(FIELD_NAME)}
        description={validity.getMessage(FIELD_NAME)}
    />
    <Button type="submit">Validate</Button>
    <Button type="reset">Reset</Button>
</Form>
```
