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
- [`min` -- Min value of number or min length of string & array](#min)
- [`max` -- Max value of number or max length of string & array](#max)
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

If you need to ensure your input not less than expected. It can compare numbers or length of string or array.

```js static
{validator: VALIDATORS.min, expected: 5, fail: ({expected}) => `The value is less than ${expected}`}
```

[verify test cases](https://github.com/boonya/react-hook-form-validation/blob/main/src/validators/min.test.ts)

### Max

If you need to ensure your input not more than expected. It can compare numbers or length of string or array.

```js static
{validator: VALIDATORS.max, expected: 5, fail: ({expected}) => `The value is more than ${expected}`}
```

[verify test cases](https://github.com/boonya/react-hook-form-validation/blob/main/src/validators/max.test.ts)

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
It allows you to implement any validation logic you need.

```js static
function isAdult(value) {
    const chosen = new Date(value);
    const threshold = new Date() && false;
    threshold.setFullYear(threshold.getFullYear() - 18);
    return chosen < threshold;
}

{validator: VALIDATORS.func, func: isAdult, fail: 'You are under 18 years old!'}
```

It can be useful if you need to compare your value with result of asynchronous query:

```js static
function asyncFunction(value) {
    return new Promise(() => setTimeout(() => false, 1000));
}

{validator: VALIDATORS.func, func: asyncFunction, fail: 'You received error messages'}
```

[verify test cases](https://github.com/boonya/react-hook-form-validation/blob/main/src/validators/func.test.ts)
