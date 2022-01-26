```js
import {useMemo, useCallback} from 'react';
import useValidation, {validateFunc} from 'react-hook-form-validation';

const FIELD_NAME = 'even-number';

function isEven(input) {
    const value = Number(input);
    return !Number.isNaN(value) && value % 2 === 0;
}

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        validateFunc(isEven, {
            fail: 'This is not an even number.',
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
        label="Enter an even number"
        required
        aria-invalid={validity.isPristine(FIELD_NAME) ? undefined : validity.isError(FIELD_NAME)}
        description={validity.getMessage(FIELD_NAME)}
    />
    <Button type="submit">Validate</Button>
    <Button type="reset">Reset</Button>
</Form>
```

Sometimes you may need to print something more specific rather than just "valid" or "invalid". For that purpose you may return an array from your function. Where the first element should be a sign of validity, and the rest will be proxied into the message builder function.

```js
import {useMemo, useCallback} from 'react';
import useValidation, {validateFunc} from 'react-hook-form-validation';

const FIELD_NAME = 'fruit';

function guessFruit(input) {
    if (typeof input !== 'string') {
        return false;
    }
    const FRUITS = ['apple', 'banana', 'kiwi'];
    if (FRUITS.includes(input.toLowerCase())) {
        return true;
    }
    return [false, ...FRUITS];
}

const {validity, validateForm, resetForm} = useValidation([{
    field: FIELD_NAME,
    rules: [
        validateFunc(guessFruit, {
            fail: ({input, payload}) => `Guessed wrong. It should have been ${payload.join(', ')}.`,
            success: 'Correct',
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
        id="guess-fruit"
        name={FIELD_NAME}
        label="Guess a fruit"
        required
        aria-invalid={validity.isPristine(FIELD_NAME) ? undefined : validity.isError(FIELD_NAME)}
        description={validity.getMessage(FIELD_NAME)}
    />
    <Button type="submit">Validate</Button>
    <Button type="reset">Reset</Button>
</Form>
```
