import React from 'react';
import {TextField, Typography} from '@material-ui/core';
import useValidation, {VALIDATORS} from 'react-hook-form-validation';
import BaseForm from './BaseForm';
import { useTranslation } from 'react-i18next';

const guessRandomNumber = async (input) => {
	const response = await fetch('https://api.random.org/json-rpc/4/invoke', {
		method: "POST",
		body: JSON.stringify({
			jsonrpc: "2.0",
			method: "generateIntegers",
			id: 1,
			params: {
				apiKey: process.env.REACT_APP_RANDOM_ORG_API_KEY,
				n: 1,
				min: 0,
				max: 10
			}
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const json = await response.json();
	const number = json.result.random.data[0];
	return [input === number, number];
 };

export default function Form(props) {
	const [loading, setLoading] = React.useState(false);
	const {t} = useTranslation('async-form');

	const {validity, validateForm, resetForm} = useValidation([{
		field: 'number',
		rules: [
			{validator: VALIDATORS.required, fail: t('error-field-required')},
			{validator: VALIDATORS.min, expected: 0, fail: t('error-field-min-0')},
			{validator: VALIDATORS.max, expected: 10, fail: t('error-field-max-10')},
			{
				validator: VALIDATORS.func,
				func: guessRandomNumber,
				fail: (number) => t('error-guessed-wrong', {number}),
				success: t('bingo'),
			},
		],
	}]);

	const onSubmit = React.useCallback(async (event) => {
		setLoading(true);
		const value = Number(event.target.number.value);
		try {
			await validateForm({number: [value]});
		} catch (err) {
			console.error('Validation failed: ', err);
			alert('Something went wrong');
		}
		setLoading(false);
	}, [validateForm]);

	return (
		<BaseForm
			onSubmit={onSubmit}
			onReset={resetForm}
			dirty={validity.isDirty()}
			valid={validity.isValid()}
			disabled={loading}
			{...props}
		>
			<Typography variant="h4" gutterBottom>{t('async-validator-form-title')}</Typography>
			<TextField
				label={t('try-guess-from-0-to-10')}
				name="number"
				type="number"
				error={validity.isError('number')}
				helperText={validity.getMessage('number')}
				required
				inputProps={{min: 0, max: 10}}
				disabled={loading}
				fullWidth
				margin="normal"
			/>
		</BaseForm>
	)
}
