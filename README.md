# React Hook for Form Validation

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
   {validator: VALIDATORS.custom, func: isAdult, message: 'You are under 18 years old!'},
   {validator: VALIDATORS.custom, func: isUnderEighty, message: 'No way!'},
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
