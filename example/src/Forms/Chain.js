import React from 'react';
import {TextField, Typography} from '@material-ui/core';
import useValidation, {VALIDATORS} from 'react-hook-form-validation';
import BaseForm from './BaseForm';
import { useTranslation } from 'react-i18next';

function yearsAgo(value) {
	const threshold = new Date();
	return threshold.setFullYear(threshold.getFullYear() - value);
}

function isMore18(input) {
	return new Date(input) < yearsAgo(18);
}

function isLess80(input) {
	return new Date(input) >= yearsAgo(80);
};

export default function Form(props) {
	const {t} = useTranslation('chain-form');

	const {validity, validateForm, resetForm} = useValidation([{
		field: 'dob',
		rules: [
			{validator: VALIDATORS.required, fail: t('error-field-required')},
			{validator: VALIDATORS.func, func: isMore18, fail: t('error-under-18-years-old')},
			{validator: VALIDATORS.func, func: isLess80, fail: t('error-old-timer')},
		],
	}]);

	const onSubmit = React.useCallback(async (event) => {
		const {dob} = event.target;
		await validateForm({dob: [dob.value]});
	}, [validateForm]);

	return (
		<BaseForm
			onSubmit={onSubmit}
			onReset={resetForm}
			dirty={validity.isDirty()}
			valid={validity.isValid()}
			{...props}
		>
			<Typography variant="h4" gutterBottom>Here you can check how validators chain works.</Typography>
			<Typography paragraph>
				The first is to check for the presence of a value. "Required" in other words.
			</Typography>
			<Typography paragraph>
				The second and third validators are "func". They execute a function against field value.
				If this function returns "true" that means a value is valid.
			</Typography>
			<Typography paragraph>
				So, second validator checks whether you are adult or not.
			</Typography>
			<Typography paragraph>
				The third one checks whether you are older than 80.
			</Typography>
			<TextField
				label={t('date-of-birth')}
				name="dob"
				type="date"
				error={validity.isError('dob')}
				helperText={validity.isError('dob') && validity.getMessage('dob')}
				required
				fullWidth
				margin="normal"
			/>
		</BaseForm>
	)
}
