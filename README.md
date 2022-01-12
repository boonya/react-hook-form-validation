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

- [`required` -- Required value](#required)
- [`min` -- Min value of a number](#min)
- [`max` -- Max value of a number](#max)
- [`minLength` -- Min length of a string or an array](#min-length)
- [`maxLength` -- Max length of a string or an array](#max-length)
- [`email` -- Email address](#email)
- [`url` -- URL](#url)
- [`pattern` -- RegEx pattern based](#pattern)
- [`func` -- function based](#func)

You can import enum of them:

```js static
import {VALIDATORS} from 'react-hook-form-validation';
```

### Required

This validator can be useful if you need to be sure that your input value is defined,
is not an empty string, array or object, is not a null.
_Note that_ other validators do not perform their logic if empty value passed to them. So, make sure you use `required` validator if needed.

```js static
{validator: VALIDATORS.required, fail: 'The field is required'}
```

[verify test cases](https://github.com/boonya/react-hook-form-validation/blob/main/src/validators/required.test.ts)

### Min

If you need to ensure your input value not less than expected. It can compare numbers or string like numbers.

```js static
{validator: VALIDATORS.min, expected: 5, fail: ({expected}) => `The value is less than ${expected}`}
```

[verify test cases](https://github.com/boonya/react-hook-form-validation/blob/main/src/validators/min.test.ts)

### Max

If you need to ensure your input value not more than expected. It can compare numbers or string like numbers.

```js static
{validator: VALIDATORS.max, expected: 5, fail: ({expected}) => `The value is more than ${expected}`}
```

[verify test cases](https://github.com/boonya/react-hook-form-validation/blob/main/src/validators/max.test.ts)

### Min Length

If you need to ensure your input contains not less characters or items than expected. It can compare length of a string or an array.

```js static
{validator: VALIDATORS.minLength, expected: 5, fail: ({expected}) => `The value is shorter than ${expected}`}
```

[verify test cases](https://github.com/boonya/react-hook-form-validation/blob/main/src/validators/minLength.test.ts)

### Max Length

If you need to ensure your input contains not more characters or items than expected. It can compare length of a string or an array.

```js static
{validator: VALIDATORS.maxLength, expected: 5, fail: ({expected}) => `The value is longer than ${expected}`}
```

[verify test cases](https://github.com/boonya/react-hook-form-validation/blob/main/src/validators/maxLength.test.ts)

### Email

```js static
{validator: VALIDATORS.email, fail: 'The value is not an email address'}
```

[verify test cases](https://github.com/boonya/react-hook-form-validation/blob/main/src/validators/email.test.ts)

### URL

```js static
{validator: VALIDATORS.url, fail: 'The value is not a URL'}
```

[verify test cases](https://github.com/boonya/react-hook-form-validation/blob/main/src/validators/url.test.ts)

### Pattern

In case you need to validate your input based on any random RegEx pattern you interested in, you can do it by `pattern` validator.

```js static
const pattern = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/u;

{validator: VALIDATORS.pattern, pattern, fail: 'Password must contain minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.'}
```

[verify test cases](https://github.com/boonya/react-hook-form-validation/blob/main/src/validators/pattern.test.ts)

### Func

In case you need to implement much more complex validation you can use `func` validator.
It allows you to implement any validation logic you need. Even based on asynchronous logic.

A function has to return `true` in case of you value is valid and vice versa.

```js static
function isEven(input) {
    const value = Number(input);
    return !Number.isNaN(value) && value % 2 === 0;
}

{validator: VALIDATORS.func, func: isEven, fail: 'The number is not even.'}
```

It can be useful if you need to compare your value with result of asynchronous query:

```js static
function asyncFunction(value) {
    return new Promise(() => setTimeout(() => false, 1000));
}

{validator: VALIDATORS.func, func: asyncFunction, fail: 'You received error messages'}
```

Sometimes you may need to print something more specific rather than just "valid" or "invalid". For that purpose you may return an array from your function. Where the first element should be a sign of validity, and the rest will be proxied into the message builder function.

```js static
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

{validator: VALIDATORS.func, func: guessFruit, fail: (...fruits) => `Guessed wrong. It should have been ${fruits.join(', ')}.`,}
```

[verify test cases](https://github.com/boonya/react-hook-form-validation/blob/main/src/validators/func.test.ts)
