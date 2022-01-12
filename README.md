# React Hook Form Validation

[![Verified](https://github.com/boonya/react-hook-form-validation/actions/workflows/verify.yml/badge.svg)](https://github.com/boonya/react-hook-form-validation/actions/workflows/verify.yml?query=event%3Apush+branch%3Amain)
[![Published](https://github.com/boonya/react-hook-form-validation/actions/workflows/publish.yml/badge.svg)](https://github.com/boonya/react-hook-form-validation/actions/workflows/publish.yml?query=event%3Arelease)
[![npm](https://img.shields.io/npm/v/react-hook-form-validation)](https://www.npmjs.com/package/react-hook-form-validation)
[![Maintainability](https://img.shields.io/codeclimate/maintainability-percentage/boonya/react-hook-form-validation?label=maintainability)](https://codeclimate.com/github/boonya/react-hook-form-validation)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/boonya/react-hook-form-validation)](https://codeclimate.com/github/boonya/react-hook-form-validation)
![Bundle Size](https://img.shields.io/bundlephobia/min/react-hook-form-validation)
[![Dependencies](https://img.shields.io/librariesio/release/npm/react-hook-form-validation)](https://www.npmjs.com/package/react-hook-form-validation?activeTab=dependencies)

## Table of contents

- [Installation](#installation)
- [Validators](#the-hook-currently-supports-the-following-validators)

## Installation

```bash static
npm i -S react-hook-form-validation
```

or

```bash static
yarn add react-hook-form-validation
```

## The hook currently supports the following validators

- [Required value](#required)
- [Min value of a number](#min-number)
- [Max value of a number](#max-number)
- [Min length of a string or an array](#min-length)
- [Max length of a string or an array](#max-length)
- [Email address](#email)
- [URL](#url)
- [RegEx pattern](#pattern)
- [Custom function](#func)

### Required

This validator can be useful if you want to be sure that your input value is defined, is not an empty string, array or object and is not a null.

_Note that_ other validators do not perform their logic if empty value passed to them. So, make sure you use `required` validator if needed.

```js static
import useValidation, {validateRequired} from 'react-hook-form-validation';

useValidation([{
    field: 'field-name',
    rules: [
        validateRequired(),
    ],
}]);
```

### Min Number

If you need to ensure your input value not less than expected. It can compare numbers or strings like numbers.

```js static
import useValidation, {validateMinNumber} from 'react-hook-form-validation';

useValidation([{
    field: 'field-name',
    rules: [
        validateMinNumber(5),
    ],
}]);
```

### Max Number

If you need to ensure your input value not more than expected. It can compare numbers or string like numbers.

```js static
import useValidation, {validateMaxNumber} from 'react-hook-form-validation';

useValidation([{
    field: 'field-name',
    rules: [
        validateMaxNumber(5),
    ],
}]);
```

### Min Length

If you need to ensure your input contains not less characters or items than expected. It can compare length of a string or an array.

```js static
import useValidation, {validateMinLength} from 'react-hook-form-validation';

useValidation([{
    field: 'field-name',
    rules: [
        validateMinLength(5),
    ],
}]);
```

### Max Length

If you need to ensure your input contains not more characters or items than expected. It can compare length of a string or an array.

```js static
import useValidation, {validateMaxLength} from 'react-hook-form-validation';

useValidation([{
    field: 'field-name',
    rules: [
        validateMaxLength(5),
    ],
}]);
```

### Email

```js static
import useValidation, {validateEmail} from 'react-hook-form-validation';

useValidation([{
    field: 'field-name',
    rules: [
        validateEmail(),
    ],
}]);
```

### URL

```js static
import useValidation, {validateUrl} from 'react-hook-form-validation';

useValidation([{
    field: 'field-name',
    rules: [
        validateUrl(),
    ],
}]);
```

### Pattern

In case you need to validate your input based on any random RegEx pattern you interested in

```js static
import useValidation, {validatePattern} from 'react-hook-form-validation';

useValidation([{
    field: 'field-name',
    rules: [
        validatePattern(/^[abc]+$/ui),
    ],
}]);
```

### Func

In case you need to implement much more complex validation you can use `func` validator.
It allows you to implement any validation logic you need. Even based on asynchronous logic.

A function has to return `true` in case of you value is valid and vice versa.

```js static
import useValidation, {validateFunc} from 'react-hook-form-validation';

function isEven(input) {
    const value = Number(input);
    return !Number.isNaN(value) && value % 2 === 0;
}

useValidation([{
    field: 'field-name',
    rules: [
        validateFunc(isEven),
    ],
}]);
```

It can be useful if you need to compare your value with result of asynchronous query:

```js static
import useValidation, {validateFunc} from 'react-hook-form-validation';

function asyncFunction(value) {
    return new Promise(() => setTimeout(() => false, 1000));
}

useValidation([{
    field: 'field-name',
    rules: [
        validateFunc(asyncFunction),
    ],
}]);
```

Sometimes you may need to print something more specific rather than just "valid" or "invalid". For that purpose you may return an array from your function. Where the first element should be a sign of validity, and the rest will be proxied into the message builder function.

```js static
import useValidation, {validateFunc} from 'react-hook-form-validation';

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

useValidation([{
    field: 'field-name',
    rules: [
        validateFunc(asyncFunction, {fail: ({payload}) => `Guessed wrong. It should have been ${payload.join(', ')}.`})
    ],
}]);
```
