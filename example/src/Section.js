import React from 'react';
import {Grid} from '@material-ui/core';

export default function Section({children, ...props}) {
	return (
		<Grid
			container
			justifyContent="center"
			alignItems="flex-start"
			{...props}
		>
			<Grid
				item
				xs={11}
				md={10}
				lg={9}
				xl={6}
			>
				{children}
			</Grid>
		</Grid>
	)
}
