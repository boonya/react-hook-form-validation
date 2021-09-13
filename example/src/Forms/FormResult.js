import React, {useMemo} from 'react';
import {Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(({palette, typography}) => ({
	root: {
		fontWeight: typography.fontWeightBold,
	},
	success: {
		color: palette.success.main,
	},
	error: {
		color: palette.error.main,
	},
}));

export default function FormResult({valid, ...props}) {
	const classes = useStyles(props);
	const {t} = useTranslation();

	const message = useMemo(() => {
		return valid
			? t('form-valid')
			: t('error-form-invalid');
	}, [t, valid]);

	return (
		<Typography classes={{
			root: clsx(classes.root, {
				[classes.success]: valid,
				[classes.error]: !valid,
			})}}
			{...props}
		>
			{message}
		</Typography>
	);
}
