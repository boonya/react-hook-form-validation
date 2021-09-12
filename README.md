# React Hook for Form Validation

[![Maintainability](https://api.codeclimate.com/v1/badges/5f8ba99d1a092fc6efb4/maintainability)](https://codeclimate.com/github/boonya/react-hook-form-validation/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/5f8ba99d1a092fc6efb4/test_coverage)](https://codeclimate.com/github/boonya/react-hook-form-validation/test_coverage)

## The hook currently supports the following validators

- [`required` - Required value](#required)
- [`min` - Min value of number or min length of string & array](#min)
- [`max` - Max value of number or max length of string & array](#max)
- [`email` - Email address](#email)
- [`url` - URL](#url)
- [`postalCodeCA` - Postal Code in Canada](#postal-code-in-canada)
- [`sinCA` - Social Insurance Number (SIN) in Canada](#social-insurance-number-sin-in-canada)
- [`pattern` - RegEx pattern based](#pattern)
- [`func` - function based](#func)
- [`async` - function based](#async)

You can import enum of them:

```js
import {VALIDATORS} from 'react-hook-form-validation';
```

### Required

This validator can be useful if you need to be sure that your input value is defined,
is not an empty string, array or object, is not a null.
_Note that_ other validators do not perform their logic if empty value passed to them. So, make sure you use `required` validator if needed.

```js
{validator: VALIDATORS.required, message: 'The field is required'},
```

[verify test cases](src/validators/required.test.ts)

### Min

If you need to ensure your input not less than expected. It can compare numbers or length of string or array.

```js
{validator: VALIDATORS.min, expected: 5, message: 'The value is less than 5'},
```

[verify test cases](src/validators/min.test.ts)

### Max

If you need to ensure your input not more than expected. It can compare numbers or length of string or array.

```js
{validator: VALIDATORS.max, expected: 5, message: 'The value is more than 5'},
```

[verify test cases](src/validators/max.test.ts)

### Email

```js
{validator: VALIDATORS.email, message: 'The value is not an email address'},
```

[verify test cases](src/validators/email.test.ts)

### URL

```js
{validator: VALIDATORS.url, message: 'The value is not a URL'},
```

[verify test cases](src/validators/url.test.ts)

### Postal Code in Canada

The validator could be useful when you need to validate your input as a Canadian postal code

[A bit details about Postal Codes in Canada](https://en.wikipedia.org/wiki/Postal_codes_in_Canada)

```js
{validator: VALIDATORS.postalCodeCA, message: 'It doesn\'t seem to be a Canadian Postal Code'},
```

[verify test cases](src/validators/postalCode-CA.test.ts)

### Social Insurance Number (SIN) in Canada

> A social insurance number (SIN) is a number issued to every Canadian citizen in Canada. The SIN number is a unique number that helps various government programs like tax reporting, pensions plan, employment verification, etc. A Canadian software development company is building an employee payroll application for which they are looking for a SIN validator library.

So if you need validate an input SIN number, you could you this validator.

- [Social Insurance Number – Overview](https://www.canada.ca/en/employment-social-development/services/sin.html)
- [SIN Validator challenge at the CodeCrunch](https://www.codercrunch.com/challenge/819302488/sin-validator)

```js
{validator: VALIDATORS.sinCA, message: 'It doesn\'t seem to be a Canadian Social Insurance Number'},
```

[verify test cases](src/validators/sin-CA.test.ts)

### Pattern

In case you need to validate your input based on any random RegEx pattern you interested in, you can do it by `pattern` validator.

```js
const pattern = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/u;

{validator: VALIDATORS.pattern, pattern, message: 'Password must contain minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.'},

```

[verify test cases](src/validators/pattern.test.ts)

### Func

In case you need to implement much more complex validation you can use `func` validator. It allows you to implement any validation logic you need.

```js
function isAdult(value) {
 const chosen = new Date(value);
 const threshold = new Date();
 threshold.setFullYear(threshold.getFullYear() - 18);
 return chosen < threshold;
}

{validator: VALIDATORS.func, func: isAdult, message: 'You are under 18 years old!'},
```

[verify test cases](src/validators/func.test.ts)

### Async

This validator can be useful if you need to compare your value with result of asynchronous query.

```js
function func(value) {
 return new Promise(() => setTimeout(() => false, 1000));
}

{validator: VALIDATORS.async, func, message: 'You waited for an error message'},
```

[verify test cases](src/validators/async.test.ts)

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
