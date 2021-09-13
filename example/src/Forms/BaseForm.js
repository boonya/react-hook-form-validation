import React from 'react';
import {Grid, Button} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import FormResult from './FormResult';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(({spacing}) => ({
	root: {},
	submit: {
		marginRight: spacing(2),
	},
	result: {
		marginTop: spacing(2),
	},
}));

const BaseForm = React.forwardRef(function BaseForm({className, onSubmit, dirty, valid, children, ...props}, ref) {
	const classes = useStyles(props);
	const {t} = useTranslation();

	const handleSubmit = React.useCallback((event) => {
		event.preventDefault();
		onSubmit(event);
	}, [onSubmit]);

	return (
		<form
			ref={ref}
			noValidate
			onSubmit={handleSubmit}
			className={clsx(classes.root, className)}
			{...props}
			classes={undefined}
		>
			{children}
			<Grid container justifyContent="flex-end">
				<Button type="submit" className={classes.submit}>{t('validate')}</Button>
				<Button type="reset">{t('reset')}</Button>
			</Grid>
			{dirty && <FormResult valid={valid} className={classes.result} />}
		</form>
	)
});

export default BaseForm;
