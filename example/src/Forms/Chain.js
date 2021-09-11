import React from 'react';
import {Grid, TextField, Button, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import useValidation, {VALIDATORS} from 'react-hook-form-validation';
import Result from '../Result';

const useStyles = makeStyles(({spacing}) => ({
	root: {},
	paper: {
		padding: spacing(1),
	},
	marginRight: {
		marginRight: spacing(2),
	},
	result: {
		marginTop: spacing(2),
	},
}));

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
	const classes = useStyles(props);

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
		const {dob} = event.target;
		validateForm({dob: [dob.value]});
	}, [validateForm]);

	return (
		<form noValidate onSubmit={onSubmit} onReset={resetForm} className={classes.root} {...props}>
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
				label="Date of Birth"
				name="dob"
				type="date"
				error={validity.isError('dob')}
				helperText={validity.getMessage('dob')}
				required
				fullWidth
				margin="normal"
			/>
			<Grid container justifyContent="flex-end">
				<Button type="submit" className={classes.marginRight}>Validate</Button>
				<Button type="reset">Reset</Button>
			</Grid>
			{validity.isDirty() && <Result valid={validity.isValid()} className={classes.result} />}
		</form>
	)
}
