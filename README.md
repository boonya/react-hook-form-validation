# React Hook for Form Validation

[![Maintainability](https://api.codeclimate.com/v1/badges/5f8ba99d1a092fc6efb4/maintainability)](https://codeclimate.com/github/boonya/react-hook-form-validation/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5f8ba99d1a092fc6efb4/test_coverage)](https://codeclimate.com/github/boonya/react-hook-form-validation/test_coverage)

## The hook currently supports the following validators

- [`required` - Required value](#required)
- [`min` - Min value of number or min length of string & array](#min)
- [`max` - Max value of number or max length of string & array](#max)
- [`email` - Email address](#email)
- [`url` - URL](#url)
- [`postalCodeCA` - Postal Code in Canada](#postalcodeca)
- [`sinCA` - Social Insurance Number (SIN) in Canada](#sinca)
- [`pattern` - RegEx pattern based](#pattern)
- [`func` - function based](#func)

You can import enum of them:

```js
import {VALIDATORS} from 'react-hook-form-validation';
```

## Required

This validator can be useful if you need to be sure that your input value is defined,
is not an empty string, array or object, is not a null.
_Note that_ other validators do not perform their logic if empty value passed to them. So, make sure you use `required` validator if needed.

```js
{validator: VALIDATORS.required, message: 'The field is required'},
```

[You can verify test cases here](src/validators/required.test.ts)

## Min

If you need to ensure your input not less than expected. It can compare numbers or length of string or array.

```js
{validator: VALIDATORS.min, expected: 5, message: 'The value is less than 5'},
```

[You can verify test cases here](src/validators/min.test.ts)

## Max

If you need to ensure your input not more than expected. It can compare numbers or length of string or array.

```js
{validator: VALIDATORS.max, expected: 5, message: 'The value is more than 5'},
```

[You can verify test cases here](src/validators/max.test.ts)

## Postal Code CA

The validator could be useful when you need to validate your input as a canadian postal code https://en.wikipedia.org/wiki/Postal_codes_in_Canada

```js
{validator: VALIDATORS.postalCodeCA, message: 'It doesn\'t seem to be a Canadian postal code'},
```

[You can verify test cases here](src/validators/postalCode-CA.test.ts)

## Example

```js
import React from 'react';
import useValidation, {VALIDATORS} from 'react-hook-form-validation';

const isAdult = (value) => {
 const chosen = new Date(value);
 const threshold = new Date();
 threshold.setFullYear(threshold.getFullYear() - 18);
 return chosen < threshold;
}

const isUnderEighty = (value) => {
 const chosen = new Date(value);
 const threshold = new Date();
 threshold.setFullYear(threshold.getFullYear() - 80);
 return chosen >= threshold;
};

export default function Form(props) {
 const {validity, validateForm, resetForm} = useValidation([{
  field: 'dob',
  rules: [
   {validator: VALIDATORS.required, message: 'The field is required'},
   {validator: VALIDATORS.func, func: isAdult, message: 'You are under 18 years old!'},
   {validator: VALIDATORS.func, func: isUnderEighty, message: 'No way!'},
  ],
 }]);

 const onSubmit = React.useCallback((event) => {
  event.preventDefault();
  const dob = event.target.dob.value;
  validateForm({dob: [dob]});
 }, [validateForm]);

 return (
  <form noValidate onSubmit={onSubmit} onReset={resetForm}>
    <label for="dob">Date of Birth *</label>
    <input
      id="dob"
      name="dob"
      type="date"
      aria-describedby="helper-text"
      aria-invalid={validity.isError('dob')}
      required
    />
    <p id="helper-text">{validity.getMessage('dob')}</p>
    <button type="submit">Validate</button>
    <button type="reset">Reset</button>
   {validity.isDirty() && (validity.isValid() ? "The form is Form is valid" : "The form is invalid")}
  </form>
 )
}
```
