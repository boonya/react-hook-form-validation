import React from 'react';
import {Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(({palette, typography}) => ({
	root: {
		fontWeight: typography.fontWeightSemiBold,
	},
	success: {
		color: palette.success.main,
	},
	error: {
		color: palette.error.main,
	},
}));

export default function Result({valid, ...props}) {
	const classes = useStyles(props);

	if (valid) {
		return (
			<Typography classes={{root: `${classes.root} ${classes.success}`}} {...props}>
				The form is valid!
			</Typography>
		);
	}

	return (
		<Typography classes={{root: `${classes.root} ${classes.error}`}} {...props}>
			The form is not valid!
		</Typography>
	);
}
